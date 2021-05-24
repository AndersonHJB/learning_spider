# -*- encoding: utf-8 -*-
'''
@Time    :   2018-3-29
@Author  :   EvilRecluse
@Contact :   https://github.com/RecluseXU
@Desc    :   人脸检测
'''

# here put the import lib
import cv2 as cv
import numpy as np


def face_detect_demo(src):
    gray = cv.cvtColor(src, cv.COLOR_BGR2GRAY)
    face_detector = cv.CascadeClassifier(
        'example/0_Basic_usage_of_the_library/openCV/23-haarcascade_frontalface_alt_tree.xml')
    face = face_detector.detectMultiScale(gray, 1.1, 2)
    # 第二个参数决定金字塔层数，越高越是快
    # 注意第三个参数，多特征识别，当有 这个数以上认为是目标才确定是目标。
    for x, y, w, h in face:
        cv.rectangle(src, (x, y), (x+w, y+h), (0, 0, 255), 2)
    cv.imshow('camera', src)
    cv.waitKey(10)


def camara_detect_demo():
    capture = cv.VideoCapture(0)
    while(True):
        ret, frame = capture.read()
        frame = cv.flip(frame, 1)
        face_detect_demo(frame)


cv.namedWindow('camera', cv.WINDOW_AUTOSIZE)
src = cv.imread('example/0_Basic_usage_of_the_library/openCV/picture/zxc.jpg')
cv.imshow('src', src)

face_detect_demo(src)
camara_detect_demo()

cv.waitKey(0)
cv.destroyAllWindows()
