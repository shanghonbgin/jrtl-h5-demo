#!/bin/sh
set -e
echo $(date +"%Y-%m-%d %H:%M:%S") 'build begin'

mkdir -p output
echo $(date +"%Y-%m-%d %H:%M:%S") 'mkdir output end'

cp -r public src package.json  output
mkdir -p output/bin
mkdir -p log

cp -r control output/bin
chmod +x output/bin/control

cd output
mkdir -p  node_modules
chmod -R 777 node_modules
rm -rf package-lock.json

echo $(date +"%Y-%m-%d %H:%M:%S") 'server end'

npm config set registry https://registry.npm.taobao.org
npm config set @jd:registry http://registry.m.jd.com
npm config set @jdcloud:registry http://registry.m.jd.com
npm config set @jcloud-mt:registry http://registry.m.jd.com

echo $(date +"%Y-%m-%d %H:%M:%S") 'npm install package.json begin'
npm install
echo $(date +"%Y-%m-%d %H:%M:%S") 'npm install package.json end'

