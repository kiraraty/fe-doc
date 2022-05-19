echo '--------upload files start--------'

git add .

git status

git commit -m 'auto update'

echo '--------commit successfully--------'

git push -u https://github.com/kiraraty/fe-doc.git master

echo '--------push to GitHub successfully--------'
