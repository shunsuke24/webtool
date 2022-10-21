#!/bin/sh

echo "express-entrypoint.sh is working"
npm install
npm install cors
npm run start




# #!/bin/sh

# echo "Expressのエントリーポイント"
# echo "$NODE_ENV モードで稼働しています..."

# if [ "$NODE_ENV" = 'development' ]; then
#   echo "npm installを開始します..."
#   npm install --prefer-offline --no-audit
# fi

# if [ ${COMMAND+x} ]; then
#   echo "次のnpmコマンドを開始します。 $COMMAND ..."
#   npm run $COMMAND
# fi