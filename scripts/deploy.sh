cd `pwd`
echo `pwd`
npm i
cd base-packages
echo `pwd`
npm i
cd ..
echo `pwd`
pm2 start pm2.config.js
