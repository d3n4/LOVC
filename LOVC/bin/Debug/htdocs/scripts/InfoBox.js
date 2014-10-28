function InfoBox(){
    /*
     <InfoBox>
     <InfoTitle>[Bot] Jimmy</InfoTitle>
     <img src="http://46.211.56.229/LOVC/gamedata/character/model/3.png" />
     <InfoBadges>
     <img src="http://46.211.56.229/LOVC/gamedata/crud/BOT.gif" />
     <img src="http://46.211.56.229/LOVC/gamedata/crud/BE2.gif" />
     </InfoBadges>
     <InfoContent>
     <actionButton>Добавить в друзья</actionButton>
     <actionButton>Обмен</actionButton>
     <actionButton>Модерация</actionButton>
     </InfoContent>
     </InfoBox>
    */
    this.id = InfoBox.stack.length;
    InfoBox.stack.push(this);
    this.entity = Crafty.e("2D, DOM, HTML")
        .replace('<InfoBox id="InfoBox'+this.id+'"><InfoTitle>empty</InfoTitle></InfoBox>')
        .attr({"x":GAME_WIDTH-185,"y":GAME_HEIGHT-285});
}

InfoBox.stack = [];