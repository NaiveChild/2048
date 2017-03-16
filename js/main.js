var nums=new Array();

$(function(){
	newGame();
});

//开始新游戏
function newGame(){
	//初始化页面
	init();
	//再随机的两个格子中产生随机数
	generateNumber();
	generateNumber();
}


//初始化
function init(){
	//初始化单元格的位置
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i));
			gridCell.css("left",getPosLeft(j));
		}
	}


	//初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();
		for(var j=0;j<4;j++){
			nums[i][j]=0;
		}
	}

	updateView();  //更新页面视图，即刷新上层的16个单元格
}


//在随机位置上产生一个随机数
function generateNumber(){
	//判断是否还有空间，如果没有
	if(noSpace()){
		return;
	}

	//随机一个位置，思路：把所有空位置取出来存放到数组中，然后在数组中随机选一个
	var temp=new Array();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){//i和j的范围在0-3
				temp.push(i*4+j);  //3,1   3*4+1=13
			}
		}
	}


	var pos=Math.floor(Math.random()*(temp.length));
	var x=Math.floor(temp[pos]/4);
	var y=Math.floor(temp[pos]%4);

	//随机一个数字
	var randNumber=Math.random()>0.5?2:4;
	nums[x][y]=randNumber;
	showNumberWithAnimation(x,y,randNumber);

}

//更新视图
function updateView(){
	//将上层的元素清空
	$(".number-cell").remove();

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");

			var numberCell=$("#number-cell-"+i+"-"+j);
			if(nums[i][j]!=0){
				numberCell.css("width","100px");
				numberCell.css("height","100px");
				numberCell.css("top",getPosTop(i));
				numberCell.css("left",getPosLeft(j));
				numberCell.css("background-color",getNumberBackgroundColor(nums[i][j]));
				numberCell.css("color",getNumberColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}else{
				numberCell.css("width","0px");
				numberCell.css("height","0px");
				numberCell.css("top",getPosTop(i)+50);
				numberCell.css("left",getPosLeft(j)+50);
			}
		}
	}
}


//实现键盘响应
$(document).keydown(function(event){
	event.preventDefault();//阻止事件的默认动作，否则会出现按上下方向键时滚动条跟着动
	switch (event.keyCode) {
		case 37://left
			if(canMoveLeft(nums)){//判断是否可以向左移动
				moveLeft();
				setTimeout(generateNumber,200);
			}
			break;
		case 38://up
			if(canMoveUp(nums)){
				moveUp();
				setTimeout(generateNumber,200);
			}
			break;
		case 39://right
			if(canMoveRight(nums)){
				moveRight();
				setTimeout(generateNumber,200);
			}
			break;
		case 40://down
			if(canMoveDown(nums)){
				moveDown();
				setTimeout(generateNumber,200);
			}
			break;
	}
});


/*
	向左移动
	需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
	1.落脚点没有数字，并且移动路径中没有障碍物
	2.落脚点数字和自己相等，并且移动路径中没有障碍物 
*/

function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){//从最左边开始遍历左边所有的元素，进行判断
					if(nums[i][k]==0&&noBlockHorizontal(i,k,j,nums)){//第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j]&&noBlockHorizontal(i,k,j,nums)){
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}

	setTimeout(updateView,200);
}

function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0&&noBlockHorizontal(i,j,k,nums)){//第i行的第j-k列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j]&&noBlockHorizontal(i,j,k,nums)){
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}

	setTimeout(updateView,200);
}


function moveUp(){
	for(j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j]&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}


function moveDown(){
	for(j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j]&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}




$(document).keyup(function(event) {
	//显示分数
	var count=0;
	for(var x=0;x<4;x++){
		for(y=0;y<4;y++){
			if(nums[x][y]>count){
				count=nums[x][y];
			}
		}
	}
	$("#num").html(count);

	setTimeout(isGameOver,5000);

});
	






