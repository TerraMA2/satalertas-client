#!/bin/bash
cd ../
ng build --prod --base-href /mpmt/alerta/ --deploy-url /mpmt/alerta/
sudo cp -a dist/* ../