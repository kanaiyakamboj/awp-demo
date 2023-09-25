var leftInstallMenuBtn =""; 
var rightInstallMenuBtn="";
var rightMenuBtn="";
var asideBarRight="";
var mapContainer="";
var installcontainer="";
$(document).ready(function(){
    leftInstallMenuBtn =document.getElementById("LeftPannelIcon1");
    rightInstallMenuBtn =document.getElementById("RightPannelInstallIcon1");
    rightMenuBtn=document.getElementById("PannelMenuBtn");
    asideBarRight=document.getElementById("AsideBarRight");
    mapContainer=document.getElementById("map-container");
    installcontainer=document.getElementById("install-container");
    $(".LeftPannelIcon1").click(function(){
       toggleInstallMenu();
    });   

    $(".PannelIcon2").click(function(){
        toggleRightInstallMenu();
     });
});
function toggleRightInstallMenu(){
    $(this).toggleClass("Active", {duration:3000});
    $(".PannelIcon").removeClass("Active", {duration:3000});   
    $(".AsideBarInstallRight").toggleClass("RightPanel2Active");
    $(".AsideBarRight").removeClass("RightPanel1Active");
    $(".RightPanel1").removeClass("Active");
    $(".RightPanel2").toggleClass("Active");
    
    if($(".AsideBarRight").hasClass("Active")){
        toggelProjectSelectDiv();
        removeClasses([rightMenuBtn], "display-block");
        addClasses([rightMenuBtn], "display-none");
    }
    if(!$(".AsideBarInstallRight").hasClass("RightPanel2Active")){       
        addClasses([rightMenuBtn], "display-block");
        removeClasses([rightMenuBtn], "display-none");
    }
    else{
        removeClasses([rightMenuBtn], "display-block");
        addClasses([rightMenuBtn], "display-none");       
    }
}

function toggleInstallMenu() {
    $(".LeftPannelIcon1").toggleClass("Active", {duration:3000});
    removeClasses([leftInstallMenuBtn], "display-none");
    addClasses([leftInstallMenuBtn], "display-block");
    removeClasses([rightInstallMenuBtn], "display-none");
    addClasses([rightInstallMenuBtn], "display-block");
    $(".AsideBarLeft").toggleClass("AsideBarLeftActive");

    // $(".ContentWrapper").removeClass("ChangeFlex");
}

function handleInstallMenuItemClick() {
    removeClasses([mapContainer], "display-block");
    addClasses([mapContainer], "display-none");
    removeClasses([installcontainer], "display-none");
    addClasses([installcontainer], "display-block");

    toggelFilterMenu();
    // if install menu is already not opened
    if(!$(".AsideBarLeft").hasClass("AsideBarLeftActive")){
        toggleInstallMenu();
    }

}