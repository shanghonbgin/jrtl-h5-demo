import React, {Component} from "react";
import {Form, Input, Button, Layout,Select} from 'antd';

const {Content} = Layout;
const { Option } = Select;

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

class Pull extends Component {

    async onFinish(values) {
        const me = this;
        console.log('Success:', values);
        me.props.history.push({
            pathname: `${process.env.PUBLIC_URL}/room`,
            search: '?domain=' + values.domain + '&appName=' + values.appName + '&streamName=' + values.streamName+ '&optionType=2',//+ '&v='+new Date().getTime(),
            state: {
                identityId: 1
            }
        });
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (
            <div style={{float: 'center', height: '100%'}}>
                <Layout style={{padding: '0 24px 24px',height:'100vh',overflow:'auto'}}>
                    <Content
                        style={{
                            float: 'center',
                            padding: 24,
                            margin: 0,
                            height: '100%'
                        }}
                    >
                        <Form
                            {...layout}
                            style={{padding: 200, width: '80%'}}
                            name="basic"
                            initialValues={{remember: true}}
                            onFinish={this.onFinish.bind(this)}
                            onFinishFailed={this.onFinishFailed.bind(this)}
                        >
                            <Form.Item
                                label="域名"
                                name="domain"
                                initialValue={"pl3.jdcloud.com"}
                                rules={[{required: false, message: '请输入昵称!'}]}
                            >
                                <Input disabled={true} defaultValue={"pu3.jdcloud.com"}
                                />
                            </Form.Item>
                            <Form.Item
                                label="App"
                                name="appName"
                                initialValue={"jrtl"}
                                rules={[{required: false, message: '请输入昵称!'}]}
                            >
                                <Input disabled={true} defaultValue={"jrtl"} />
                            </Form.Item>
                            <Form.Item
                                label="流名"
                                name="streamName"
                                rules={[{required: true, message: '请输入昵称!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    拉流
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Pull;