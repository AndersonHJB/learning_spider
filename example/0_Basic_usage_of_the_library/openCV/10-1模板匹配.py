# -*- encoding: utf-8 -*-
'''
@Time    :   2018-3-23
@Author  :   EvilRecluse
@Contact :   https://github.com/RecluseXU
@Desc    :   模板匹配
'''

# here put the import lib
import cv2 as cv
import numpy as np


def template_demo(target, tpl):
    methods = [cv.TM_SQDIFF_NORMED, cv.TM_CCORR_NORMED, cv.TM_CCOEFF_NORMED]
    target_h, target_w = tpl.shape[:2]
    for method in methods:
        result = cv.matchTemplate(target, tpl, method)
        min_val, max_val, min_loc, max_loc = cv.minMaxLoc(result)
        if(method == cv.TM_SQDIFF_NORMED):
            tl = min_loc
        else:
            tl = max_loc
        br = (tl[0]+target_w, tl[1]+target_h)
        cv.rectangle(target, tl, br, (0, 0, 255), 2)
        cv.imshow('match-'+np.str(method), target)
        cv.imwrite('result/10-1match-'+np.str(method)+'.png', target)
        cv.imshow('methodResult-'+np.str(method), result)
        cv.imwrite('result/10-1methodResult-'+np.str(method)+'.png', target)


src = cv.imread(
    'example/0_Basic_usage_of_the_library/openCV/picture/angle1.jpg')
src1 = cv.imread(
    'example/0_Basic_usage_of_the_library/openCV/picture/handOfAngle1.png')
cv.imshow('src', src)
cv.imshow('src1', src1)

template_demo(src, src1)

cv.waitKey(0)
cv.destroyAllWindows()
