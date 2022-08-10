import React, {Component} from 'react';
import {Layout} from 'antd';
import FetchUtil from '../util/FetchUtil';
import md5 from "js-md5";
const {Content} = Layout;

const VIDEO_CONSTRAINS ={
    nhd : { width: { ideal: 320}, height: { ideal: 180 }, frameRate: { ideal: 25 } },
    hd : { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 25 } },
    fhd  : { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 25 } }
};

class Client extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMsg:'等待中.........',
            localVideoInfo: {
                videoTrack: null,
                nickName: null,
                mediaServerIp:null
            },
            peersInfo: []
        }
        this.pushStreamUrl=null;
        this.optionType = 2;
        this.rtcPeerConnection= null;
        this.device={
            deviceId:md5("H5"+new Date().getTime()),
            deviceName:'Chrome',
            deviceTYpe: 'H5',
            deviceMode: 'Chrome 74',
            sdkVersion:'0.0.1'
        }
    }

    componentWillMount(){
        const me=this;
        const {domain, appName, streamName,optionType} = FetchUtil.decodeQuery(this.props.location.search);
        if (!domain || !appName || !streamName) {
            if(!optionType){
                me.props.history.push({pathname: `${process.env.PUBLIC_URL}/home`});
                return;
            }
            if(optionType == 1){
                me.props.history.push({pathname: `${process.env.PUBLIC_URL}/push`});
                return;
            }
            if(optionType == 2){
                me.props.history.push({pathname: `${process.env.PUBLIC_URL}/pull`});
                return;
            }
            me.props.history.push({pathname: `${process.env.PUBLIC_URL}/home`});
            return;
        }
        me.pushStreamUrl="jrtl://"+domain+"/"+appName+"/"+streamName+"?stream_index=0&auth_key=qazsdsa212dq22e32323";
        me.optionType = optionType;
    }

    componentDidMount() {
        this.connectSocket().catch();
    }

    componentWillUnmount() {
        if (this.rtcPeerConnection) {
            this.rtcPeerConnection.close();
            this.rtcPeerConnection=null;
        }
    }

    //初始连接
    async connectSocket(reconnect) {
        const me = this;
        const optionType = me.optionType || 1;
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            console.error("not support.")
            return;
        }
        if(optionType == 1){
            const stream= await navigator.mediaDevices.getUserMedia({
                video :{
                    ...VIDEO_CONSTRAINS['fhd']
                }, audio: true
            }).catch(reason => {
                console.info(reason);
            });
            const tracks=new Array();
            tracks.push(stream.getVideoTracks()[0]);
            tracks.push(stream.getAudioTracks()[0]);
            await me.pushStream(tracks).catch(reason => {
                console.error("pushStream error.",reason);
            });
        }else{
            me.pullStream().catch(reason => {
                console.error("pullStream error."+reason);
            });
        }
    };

    async pushStream(tracks){
        const me=this;
        const {consumeVideo} = this.refs;

        me.rtcPeerConnection = new RTCPeerConnection();
        me.rtcPeerConnection.onicecandidate=(e)=>{
            console.info(e);
        }
        me.rtcPeerConnection.onremovestream=(e)=>{
            console.info(e);
        }

        const stream = new MediaStream();
        for(let track of tracks){
            me.rtcPeerConnection.addTrack(track);
            stream.addTrack(track);
        }
        const offer = await me.rtcPeerConnection.createOffer();
        await me.rtcPeerConnection.setLocalDescription(offer).catch(reason => {
            console.error(reason);
        });
        const answer =await me.getPushStreamRemoteDescription(offer.sdp).catch(reason => {
            console.error(reason);
        });
        if(answer){
            await me.rtcPeerConnection.setRemoteDescription(answer).catch(reason => {
                console.error(reason);
            })
            consumeVideo.srcObject= stream;
            //consumeVideo.play();
            me.setState({showMsg:"推流中"});
        }
    }
    async pullStream(){
        const me=this;
        const {consumeVideo} = this.refs;

        me.rtcPeerConnection =new RTCPeerConnection();
        const offer =await me.rtcPeerConnection.createOffer({offerToReceiveAudio:1,offerToReceiveVideo: 1});

        me.rtcPeerConnection.addEventListener("track",async (e)=>{
            await consumeVideo.load();
            consumeVideo.srcObject= e.streams[0];
            me.setState({showMsg:"拉流中"});
        },false);
        const remoteOffer = await me.getPullStreamRemoteDescription(offer.sdp);
        if(remoteOffer){
            await me.rtcPeerConnection.setRemoteDescription(remoteOffer).catch(reason => {
                console.error("rtcPeerConnection.setRemoteDescription error:",reason);
            });
        }
        let answer = await me.rtcPeerConnection.createAnswer();
        await me.rtcPeerConnection.setLocalDescription(answer).catch(reason => {
            console.error(reason);
        });
    }

    async getPushStreamRemoteDescription(sdp){
        const pushStreamUrl = this.pushStreamUrl;
        const body = await FetchUtil.post('/v1/pushStreamStart', {
            version:1,
            pushStreamUrl,
            sdp,
            device:{...this.device}
        });
        console.info("/v1/startPushStream result:%s",JSON.stringify(body));
        const answer = { type: 'answer', sdp: body.data.sdp};
        return answer;
    }

    async getPullStreamRemoteDescription(sdp){
        const pullStreamUrl = this.pushStreamUrl;
        const body = await FetchUtil.post('/v1/pullStreamStart', {
            version:1,
            pullStreamUrl,
            sdp,
            device:{...this.device}
        });
        console.info("/v1/startPullStream result:%s",JSON.stringify(body));
        const answer = { type: 'offer', sdp: body.data.sdp};
        return answer;
    }
    render() {
        const me = this;
        const {showMsg} =me.state;
        return (
            <div>
                <Layout className="layout" style={{height: '100vh', overflow: 'auto'}}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 10,
                            margin: 0,
                            minHeight: 10,
                        }}>
                        <p><b>{showMsg}</b></p>
                        <video
                            style={{width:'100%'}}
                            autoPlay
                            playsInline
                            muted
                            controls={true}
                            ref="consumeVideo">
                            不支持
                        </video>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Client;
