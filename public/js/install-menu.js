$(document).ready(function(){
    $(".PannelIcon").click(function(){
        $(this).toggleClass("Active", {duration:3000});
        $(".PannelIcon2").removeClass("Active", {duration:3000});
        $(".AsideBarRight").toggleClass("RightPanel1Active");
        $(".AsideBarRight").removeClass("RightPanel2Active");
        $(".RightPanel1").toggleClass("Active");
        $(".RightPanel2").removeClass("Active");
        $(".ContentWrapper").toggleClass("ChangeFlex");
        $(".ContentWrapper").removeClass("panel2");
    });

    $(".PannelIcon2").click(function(){
        $(this).toggleClass("Active", {duration:3000});
        $(".PannelIcon").removeClass("Active", {duration:3000});
        $(".AsideBarRight").toggleClass("RightPanel2Active");
        $(".AsideBarRight").removeClass("RightPanel1Active");
        $(".RightPanel1").removeClass("Active");
        $(".RightPanel2").toggleClass("Active");
        $(".ContentWrapper").toggleClass("panel2");
        $(".ContentWrapper").removeClass("ChangeFlex");
    });
   
    $(".LeftPannelIcon1").click(function(){
       toggleInstallMenu();
    });  
});

function toggleInstallMenu() {
    $(".LeftPannelIcon1").toggleClass("Active", {duration:3000});
    removeClasses([leftInstallMenuBtn], "display-none");
    addClasses([leftInstallMenuBtn], "display-block");
    removeClasses([rightInstallMenuBtn], "display-none");
    addClasses([rightInstallMenuBtn], "display-block");
    $(".AsideBarLeft").toggleClass("AsideBarLeftActive");
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