import urllib.request, urllib.parse , urllib.error
import json

serviceurl = 'http://localhost:3000/api/?'

while True:
    title = input('Titulo o algun rastro: ')#Programming
    name = input("Autor: ")
    year = input("Año de edicion (aaaa): ")
    #/?title=Ja&name=Ch&year=2017
    if len(title)<1 and len(name) < 1 and len(year)<4:break
    url = serviceurl + urllib.parse.urlencode({'title':title,'name':name,
    'year':year})
    #url='http://localhost:3000/api/?title=JavaScript%20Programming'
    #http://maps.googleapis.com/api/geocode/json?address=Ann+Arbor%2C+MI
    print('Retrieving', url)
    uh = urllib.request.urlopen(url)#abriendo la pagina
    #se recibira lo siguiente:
    #esta llave indica que es un objeto, entonces python lo tratara como un
    #diccionario
#########################
    """
    Esquema de consulta recibida:
    var bookSchema = new Schema({
    title:{type:String , required:true , unique:true },
    year:Number,
    authors:[authorSchema]
    """
#########################
    data = uh.read().decode()#leyendo la data y con decode pasando de formato
    #utf-8 a unicode string
    print('Retrieved',len(data),'characters')

    try:
        js = json.loads(data)#en este caso google devolvera un objeto porque
        #empieza con llaves {} entoncendes al decodificar python lo reconocera
        #como un DICCIONARIO
        #print(js)
    except:
        print("error")
        js =None
    """
    if not js or 'status' not in js or js['status']!='OK':
        print('========Failiure to retrieve========')
        print(data)
        continue
    """

    i = 0
    for item in js:
        print('\n')
        i=i+1
        print('Item',i,' :')
        title = item['title']
        year = item['year']
        print(title)
        print(year)
        authors = item['authors']
        author_cont =0
        for author in authors:
            author_cont = author_cont+1
            print('author',author_cont,' :',author['name'])
    print('\n')
    y=input('Desea salir? (y/n): ')
    if y=='y':
        break
