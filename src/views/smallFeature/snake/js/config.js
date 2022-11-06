//存储地图对象  坐标x，y
var griData = []
//整个网格的行列
var tr = 30 //行 y 
var td = 30 //列 x 
//蛇的身体大小   一个格子的大小width/tr
// 1.先获取container元素
// 2.在通过container元素获取width 但是此时带有px单位
// 3.通过split方法去掉px
// 4.在通过parseInt转化为数字 就获取了width大小
var snakeBody = parseInt(window.getComputedStyle(document.getElementsByClassName('container')[0], null).width.split('px')) / tr
//明确新的蛇头和旧的蛇头之间的位置关系
//我们在确定新的蛇头坐标的时候，会拿下面的对象和旧蛇头做一个计算
var directionNum={
  left:{x:-1,y:0,flag:'left'},
  top:{x:0,y:-1,flag:'top'},
  right:{x:1,y:0,flag:'right'},
  bottom:{x:0,y:1,flag:'bottom'}
}
//蛇相关的配置
var snake = {
  //蛇的初始位置
  snakePos: [
    { x: 0, y: 0, domContent: '', flag: 'body' },
    { x: 1, y: 0, domContent: '', flag: 'body' },
    { x: 2, y: 0, domContent: '', flag: 'body' },
    { x: 3, y: 0, domContent: '', flag: 'head' },
  ],
  //蛇一开始移动的方法
  direction:directionNum.right
}

//食物相关的配置
var food = {
  //食物的初始位置
  x: 0,
  y: 0,
  domContent: '',
}

//游戏分数
var score = 0

//停止计时器
var timerStop = null
//计时器事件
var speed =200
//防止重复执行setInterval
var flag=true

