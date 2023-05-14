from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import requests

# set credentials + initialize
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "dayleez-d450e",
    "private_key_id": "7a16bb508c1f7a04862a9aeb559e6536a68319b5",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqf/0PjCymhlRO\nLfgfKf1kCMy8Wmu2dGhC609Z4aI3Q6JqQGPZS8DPKYUWmfnQ94+YwvEoEKGLqCJm\nKKKooU+M4rn4imUTK0FRL+fLs+9hesYaRphFBEwkNVlZgukFRW8kQAJzCSrn1Nhq\nyQMNM9JwS2Mw4ntCjde2LbMehArHJ9iJcMAWwgecdlDXJzMwUd1LA0ns+CdkIV4Y\nUFE6l1knXTe4EWSURoM551rv4HF8fOSktnfIpVsa1CucTACvyRXaOWZVfJIUJS+B\no7qrvEydOXRhEro/5u/ojnvcXPrlg0lYoNIzPfiI4jcJ8p0d/PdVyyV0WGBgBa/5\nKF74jhxZAgMBAAECggEASE4ZieM3W0tdEFQVRwqr8l3SPxuETdhb05J5v6WWXoLw\nv+FFyFkWxOmw+zST9k53DOvC7w8duJGptaU+7k76196K6CtIGh6Cv9VNHB7Jp11z\nWuO8jL9T+PAoMjTuw6zSpbNE7hJ8E8qpxldfpQD/GJfuKEMVLYLN6gLyUWz2Y8x6\n2yHVDZ9jiYAqMCM/66YgBBAYxqxzHpmvAlUVhNv6gJ5f84ZX19I3eJfnTEuCpvnW\n89s+9axAjcP0RGGX6fvCRJjFsued3TDf4CxphVB5URJIiMj7BaCPk7zk7mz8WNYD\nF2xeo62jnjrRr6oO4lVfr7FON/ANQ7+q/ueqHf3JTwKBgQD2d1v0le0bnh1cUJTL\n8jTr5MpCYGBYakl9CmElee8EBtxYr61bBOZZNCtZgk4irGLKiv9G1FwEp78Z0zdj\nXWcos/HJLm+7k00+mxmecN2dtA47UXGP8DF6Aaf+S1Li3bi20No/6juBQ7YI0h1v\nrcGmTjKma0HE/nBxAUaueM+c0wKBgQDzkiH3x8ugn5JHLYm7HbtMRL6iWwl8c8l6\n219yrAIAm39p1++lhumLcJHqaB7AkghNtA9+UnscD1YViZZjN2pQ7DGhUxhBVVls\n8bWjEj+IYpiDZJqPohdpSv66yigdarWP/1rP1BaCmPnWNBYImX8Meq7wkW4oJoRE\nWfwkIRx2owKBgQCNqZtkIQyxFBeiKPrtoqDCebW7ozOdfjIROfcOmGBGez8Jhqho\nqY9Q9Ih6IUiR6225J12FM6hUUKqpyFqMtXIG1i8CSLuWIBuFAZcfF5Z5/7UyaSSR\n7Cg0DWGm61qP5Ys3ISJhHFvpd6bYuRSMTV4CHe5E819RQEIW4fnjbLNAWwKBgBMY\nd9VHMq2rFPrDlTK4SADYuuFbpci+AyPAoyEIXzfQ+RJBPaaKhzDJaIcqFo8eY8xD\nu5s5uDEg+qzBlqq8o3corVNqglJM8K/b21OnkJeOs0pJztxH5vH4UTQvuSllPkrF\nyEbW59ThTWT/vGJ8NjuyOpjdrfcz3dbF/0CN3/9lAoGBAMsJIbfw5AMVsVFZv+qy\nRCOeCoV1eD5Vo1g45XNV24iOE71mUfz9/tYauA+07iAmdfU/gszIXfQVPcZFVKG9\nCy9nS3E4MbB6C72pGpbNLw14PPEPBRm7dpF1l0VhxIi2IGTCpzmvvLjy0sSSgOGw\n2fHGdhGRyT5KL3uR23L2YYMm\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3kz1m@dayleez-d450e.iam.gserviceaccount.com",
    "client_id": "114695832889869686384",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3kz1m%40dayleez-d450e.iam.gserviceaccount.com"
})
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://dayleez-d450e-default-rtdb.firebaseio.com/'
})

# root url
BaseURL = "https://www.jumia.ma"

items = []

# for x in range(1, 3):
response = requests.get(
    'https://www.jumia.ma/mlp-toutes-les-boutiques-officielles/')
page_content = BeautifulSoup(response.content, "html.parser")
itemslist = page_content.find_all('article', class_="prd _fb col c-prd")
for item in itemslist:
    name = item.find('h3', class_='name').text.strip()
    price = item.find('div', class_='prc').text.strip()
    try:
        oldprice = item.find('div', class_='old').text.strip()
    except:
        oldprice = ''
    try:
        review = item.find('div', class_='rev').text.strip()
    except:
        review = ''
    img_url = item.find('img')['data-src']
    store = 'Jumia'
    item_url = item.find('a')['href']
    item_url = BaseURL + item_url
    itemdata = {
        "name": name,
        "price": price,
        "oldprice": oldprice,
        "img_url": img_url,
        "store": store,
        "review": review,
        "item_url": item_url,
        "likes": 0
    }

    items.append(itemdata)


print(len(items))

ref = db.reference('/items')
ref.set(items)
# ref.delete()
