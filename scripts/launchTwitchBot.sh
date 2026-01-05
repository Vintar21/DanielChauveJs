rm -r ./dist/*
npx tsc
sleep 2
node ./dist/app.js