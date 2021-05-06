cd `pwd`
echo `pwd`
npm i
cd base-packages
echo `pwd`
npm i
cd ..
echo `pwd`
npm run build
pm2 start pm2.config.js
