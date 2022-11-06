//游戏的主方法
function main() {
  //用户点击了开始游戏之后在左后续的工作
  var startBtn = document.getElementsByClassName('startBtn')[0]
  startBtn.onclick = function (e) {
    //阻止冒泡
    e.stopPropagation()

    //1.初始化游戏
    initGame()
    //2.绑定事件
    bindEvent()
    //3.将按钮隐藏
    startBtn.style.display='none'
    
  }
}

//初始化游戏
function initGame() {
  //1.初始化地图
  drawMap()
  //2.初始化蛇
  drawSnake(snake)
  //3.初始化食物
  drawFood()
}

//绘制地图的方法
function drawMap() {
  for (var i = 0; i < td; i++) {
    for (var j = 0; j < td; j++) {
      griData.push({ x: j, y: i }) //将所有的格子坐标存储到数组中
    }
  }
}

//绘制蛇的方法
function drawSnake(snake) {
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (!snake.snakePos[i].domContent) {
      //如果进入此if说明是第一次创建蛇
      snake.snakePos[i].domContent = document.createElement('div')
      snake.snakePos[i].domContent.style.position = 'absolute'
      snake.snakePos[i].domContent.style.width = snakeBody + 'px'
      snake.snakePos[i].domContent.style.height = snakeBody + 'px'
      snake.snakePos[i].domContent.style.left = snake.snakePos[i].x * snakeBody + 'px'
      snake.snakePos[i].domContent.style.top = snake.snakePos[i].y * snakeBody + 'px'
      if (snake.snakePos[i].flag == 'head') {
        //说明当前是蛇头
        snake.snakePos[i].domContent.style.background = `url("../img/蛇头.png") center/contain no-repeat`
        //根据方向进行一个旋转

        switch (snake.direction.flag) {
          case 'left': {
            snake.snakePos[i].domContent.style.transform = `rotate(180deg)`
            break
          }
          case 'right': {
            snake.snakePos[i].domContent.style.transform = `rotate(0deg)`
            break
          }
          case 'top': {
            snake.snakePos[i].domContent.style.transform = `rotate(270deg)`
            break
          }
          case 'bottom': {
            snake.snakePos[i].domContent.style.transform = `rotate(90deg)`
            break
          }
        }
      } else {
        //说明是蛇身
        snake.snakePos[i].domContent.style.background = '#9ddbb1'
        snake.snakePos[i].domContent.style.borderRadius = '50%'
      }
    }
    //需要将创建dom元素添加到container容器上面
    var container = document.getElementsByClassName('container')[0]
    container.appendChild(snake.snakePos[i].domContent)
  }
}
//绘制食物的方法
function drawFood() {
  //思考：
  //1.食物的坐标是随机的
  //2.食物不能生成在container的边界上及以外
  //3.食物不能生成在蛇的身体上蛇的头上
  //TODO：
  while (true) {
    //构成一个死循环 直到生成符合要求的食物坐标 才能退出循环
    var isRepeat = false
    food.x = Math.floor(Math.random() * tr) //最大值为tr-1 因为是从0开始的
    food.y = Math.floor(Math.random() * td) //最大值为td-1 因为是从0开始的
    //floor:总是返回小于等于一个给定数字的最大整数。
    //random:返回0到1之间的一个随机数
    for (var i = 0; i < snake.snakePos.length; i++) {
      if (food.x == snake.snakePos[i].x && food.y == snake.snakePos[i].y) {
        //进入此if说明食物生成在蛇的身体上
        isRepeat = true
        break
      }
    }
    if (!isRepeat) {
      //跳出while循环
      break
    }
  }
  //跳出while循环说明已经生成了符合要求的食物坐标
  if (!food.domContent) {
    food.domContent = document.createElement('div')
    food.domContent.style.position = 'absolute'
    food.domContent.style.height = snakeBody + 'px'
    food.domContent.style.width = snakeBody + 'px'
    food.domContent.style.background = `url("../img/西瓜.png") center/contain no-repeat`
    document.querySelector('.container').append(food.domContent)
  }
  food.domContent.style.left = food.x * snakeBody + 'px'
  food.domContent.style.top = food.y * snakeBody + 'px'
}

//蛇的移动方法
function snakeMove() {
  var oldHead = snake.snakePos[snake.snakePos.length - 1]
  //1.根据方向计算出新的蛇头的坐标作为
  var newHead = {
    domContent: '',
    x: oldHead.x + snake.direction.x,
    y: oldHead.y + snake.direction.y,
    flag: 'head',
  }
  //这之间要左个碰撞检测 看计算出来的蛇头有没有碰上食物或者蛇身体或者墙壁
  var collideCheckInfo = isCollide(newHead)
  //判断是否撞到东西
  if (collideCheckInfo.isCollide) {
    //如果进入此if表示碰到东西了
    var result = window.confirm(`游戏结束，你的得分为${score}分,是否重新开始？`)
    if (result) {
      //如果进来则说明重新开始
      // window.location.reload() //刷新页面
      //方法二：
      document.getElementsByClassName('container')[0].innerHTML = 
      `    <!-- 开始游戏按钮 -->
      <button class="startBtn" style="display: none"></button>
      <!-- 暂停游戏按钮 -->
      <button class="pauseBtn" style="display: none"></button>`
      score = 0
      snake = {
        //蛇的初始位置
        snakePos: [
          { x: 0, y: 0, domContent: '', flag: 'body' },
          { x: 1, y: 0, domContent: '', flag: 'body' },
          { x: 2, y: 0, domContent: '', flag: 'body' },
          { x: 3, y: 0, domContent: '', flag: 'head' },
        ],
        //蛇一开始移动的方法
        direction: directionNum.right,
      }
      food = {
        //食物的初始位置
        x: 0,
        y: 0,
        domContent: '',
      }
      initGame()
    } else {
      //结束游戏
      document.onkeydown = false

    }
    clearInterval(timerStop)
    return
  }
  //2.将旧的头修改为身体
  oldHead.flag = 'body'
  oldHead.domContent.style.background = '#9ddbb1'
  oldHead.domContent.style.borderRadius = '50%'

  //判断是否吃到东西
  if (collideCheckInfo.isEat) {
    //如果进入此if表示吃到食物了
    //重新生成食物
    drawFood()
  } else {
    //说明没有吃到食物
    document.getElementsByClassName('container')[0].removeChild(snake.snakePos[0].domContent)
    snake.snakePos.shift()
  }

  //3.将新的头添加到蛇的数组中
  snake.snakePos.push(newHead)

  //4.重新绘制蛇
  drawSnake(snake)
}

//定时器
function startGame() {
  if (flag) {
    timerStop = setInterval(function () {
      snakeMove()
      flag = false
    }, speed)
  }
}

//绑定事件
function bindEvent() {
  //1.监听用户的键盘事件 上下左右
  document.onkeydown = function (e) {
    //37 左 38上 39右 40下 ↑↓←→
    //65 a 87 w 68d 83s

    //上
    if ((e.keyCode == '38' || e.keyCode == '87') && snake.direction.flag != 'bottom') {
      snake.direction = directionNum.top
    }
    //下
    if ((e.keyCode == '40' || e.keyCode == '83') && snake.direction.flag != 'top') {
      snake.direction = directionNum.bottom
    }
    //左
    if ((e.keyCode == '37' || e.keyCode == '65') && snake.direction.flag != 'right') {
      snake.direction = directionNum.left
    }
    //右
    if ((e.keyCode == '39' || e.keyCode == '68') && snake.direction.flag != 'left') {
      snake.direction = directionNum.right
    }
    //计时器自动移动蛇
    startGame()
    //当点击container的时候暂停游戏
    document.getElementsByClassName('container')[0].onclick = function (e) {
      var pauseBtn = document.getElementsByClassName('pauseBtn')[0]
      if(e.target.className=='container'){
        pauseBtn.style.display = 'block'
        clearInterval(timerStop)
        flag = true
      }else{
        //恢复游戏操作
        pauseBtn.style.display = 'none'
        startGame()
      }

    }
    // //点击暂停按钮继续游戏
    // document.getElementsByClassName('pauseBtn')[0].onclick = function (e) {

    //   //阻止冒泡事件
    //   e.stopPropagation()
    //   document.getElementsByClassName('pauseBtn')[0].style.display = 'none'
    //   startGame()
    // }
  }
}
//碰撞检测
function isCollide(newHead) {
  var collideCheckInfo = {
    isCollide: false, //是否碰撞墙壁
    isEat: false, //是否吃到食物
  }
  ///1.判断是否碰撞墙壁
  if (newHead.x < 0 || newHead.x > td - 1 || newHead.y < 0 || newHead.y > tr - 1) {
    collideCheckInfo.isCollide = true
    return collideCheckInfo
  }

  //2.检测是否碰到自己的身体
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (newHead.x == snake.snakePos[i].x && newHead.y == snake.snakePos[i].y) {
      collideCheckInfo.isCollide = true
      return collideCheckInfo
    }
  }
  //3.判断是否吃到食物
  if (newHead.x == food.x && newHead.y == food.y) {
    collideCheckInfo.isEat = true
    score++ //分数加一
  }
  return collideCheckInfo
}

//调用主方法
main()
