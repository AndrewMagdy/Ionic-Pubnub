import cv2
import urllib
import numpy as np

TRAINSET = "lbpcascade_frontalface.xml"
DOWNSCALE = 4
classifier = cv2.CascadeClassifier(TRAINSET)

stream=urllib.urlopen('http://192.168.43.181:8080/stream/video.mjpeg')
bytes=''
while True:
    bytes+=stream.read(1024)
    a = bytes.find('\xff\xd8')
    b = bytes.find('\xff\xd9')
    if a!=-1 and b!=-1:
        jpg = bytes[a:b+2]
        bytes= bytes[b+2:]
        i = cv2.imdecode(np.fromstring(jpg, dtype=np.uint8),cv2.IMREAD_COLOR)

        minisize = (i.shape[1]/DOWNSCALE,i.shape[0]/DOWNSCALE)
        miniframe = cv2.resize(i, minisize)
        faces = classifier.detectMultiScale(miniframe)
        for f in faces:
            x, y, w, h = [ v*DOWNSCALE for v in f ]
            cv2.rectangle(i, (x,y), (x+w,y+h), (0,0,255))

        cv2.imshow('i',i)
        if cv2.waitKey(1) ==27:
            exit(0)
