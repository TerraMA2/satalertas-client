#!/bin/bash

rm /data/alerta/*

rm -rf /data/alerta/assets

rm -rf /data/alerta/terrama2-report

cd /data/alerta

git clone -b b1.0.0 -o upstream https://github.com/TerraMA2/terrama2-report.git

cd /data/alerta/terrama2-report

npm i

ng build --prod --base-href /mpmt/alerta/ --deploy-url /mpmt/alerta/

cp -a /data/alerta/terrama2-report/dist/terrama2-report/* /data/alerta/