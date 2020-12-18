<?php
session_start();


include $_SERVER['DOCUMENT_ROOT']."/PublicESI/phplib.php";
dbset();

logincheck();
?>


<?php

$character_list=array();

$qr="select characterid from PublicESI_keys where userid=".$_SESSION['PublicESI_userid']." and active=1 and service_type=\"DoYouHaveImplant\"order by charactername asc";
$result= $dbcon->query($qr);
for($i=0;$i<$result->num_rows;$i++){
    $data=$result->fetch_row();
    $character_list[$i]=$data[0];

}
?>


<html>
<head>
<?=$analytics?>
<link type="text/css" rel="stylesheet" href="https://lindows.kr/materialize/css/materialize.css">
<link type="text/css" rel="stylesheet" href="../indexcss.css">

<script src="https://lindows.kr/materialize/js/materialize.js"></script>
<script src="../indexjs.js"></script>

<script data-ad-client="ca-pub-7625490600882004" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<link rel="stylesheet" type="text/css" href="./implant.css">
<script src="implant.js"></script>
<script>
 var characters_id=new Array();

<?php
for($i=0;$i<sizeof($character_list);$i++){
    echo("characters_id[".$i."]=".$character_list[$i].";\n");
}
?>

function bodyload(){
    var left_banner=new MenuBanner(<?=$_SESSION["PublicESI_userid"]?>);
    document.body.appendChild(left_banner.div_body);
    
    for(var i=0;i<characters_id.length;i++){
        Read_Character(characters_id[i]);
    }
    Display_user_list();
}

</script>

</head>
<body onload="javascript:bodyload();">

<span style="font-size:35px">Do you have implants?</span><br>

<div id="characters_table"></div><br><br>
<div id="userlist_table"></div>

</body>
</html>