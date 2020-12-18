<?php
include $_SERVER['DOCUMENT_ROOT']."/PublicESI/phplib.php";

dbset();
session_start();

header("Content-Type: application/json");

if(isset($_GET["typeid"])){
    $qr="select * from EVEDB_Implant where typeid=".$_GET["typeid"];  
}
else if(isset($_GET["itemname"])){
    $qr="select * from EVEDB_Implant where itemname=\"".$_GET["itemname"]."\"";  
}

$result=$dbcon->query($qr);
if($result->num_rows==0){

    //임플란트 슬롯 넘버 Dogma : 331
    //Charisma point Dogma: 175 (Slot 5)
    //Intelligence point Dogma: 176 (Slot 4)
    //Memory point Dogma: 177 (Slot 2)
    //Perception point Dogma: 178 (Slot 1)
    //Willpower point Dogma: 179 (Slot 3)

    $header_type= "Content-Type:application/json";
    $itemcurl= curl_init();
    curl_setopt($itemcurl, CURLOPT_SSL_VERIFYPEER, $SSLauth); 
    curl_setopt($itemcurl,CURLOPT_HTTPGET,true);
    curl_setopt($itemcurl,CURLOPT_URL,"https://esi.evetech.net/latest/universe/types/".$_GET["typeid"]."/?datasource=tranquility&language=en-us");
    curl_setopt($itemcurl,CURLOPT_RETURNTRANSFER,true);

    $item_response=curl_exec($itemcurl);
    curl_close($itemcurl);

    $data=json_decode($item_response,true);
    switch($data["dogma_attributes"][get_dogma($data["dogma_attributes"],331)]["value"]){
        case 1:
            $t_slot=1;
            $t_attribute="Perception";
            $t_point=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],178)]["value"];
        break;
        case 2:
            $t_slot=2;
            $t_attribute="Memory";
            $t_point=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],177)]["value"];
        break;
        case 3:
            $t_slot=3;
            $t_attribute="Willpower";
            $t_point=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],179)]["value"];
        break;
        case 4:
            $t_slot=4;
            $t_attribute="Intelligence";
            $t_point=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],176)]["value"];
        break;
        case 5:
            $t_slot=5;
            $t_attribute="Charisma";
            $t_point=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],175)]["value"];
        break;
        default:
            $t_slot=$data["dogma_attributes"][get_dogma($data["dogma_attributes"],331)]["value"];
            $t_attribute="Hardwiring";
            $t_point=0;
        break;

    }
    $insertqr="insert into EVEDB_Implant (itemname,typeid,slot,attribute,point) values (\"".$data["name"]."\",".$data["type_id"].",".$t_slot.",\"".$t_attribute."\",".$t_point.");";
    $dbcon->query($insertqr);
}


$result=$dbcon->query($qr);
if($result->num_rows==0){
    echo("{}");
}
else{
    $data=$result->fetch_array();




    echo("{\n");
    echo("\"itemname\":\"".$data["itemname"]."\",\n");
    echo("\"typeid\":".$data["typeid"].",\n");
    echo("\"slot\":".$data["slot"].",\n");
    echo("\"attribute\":\"".$data["attribute"]."\",\n");
    echo("\"point\":".$data["point"]."\n");
    echo("}");

}

function get_dogma($dogma_attributes,$dogma_number){
    for($i=0;$i<sizeof($dogma_attributes);$i++){
        if($dogma_attributes[$i]["attribute_id"]==$dogma_number){
            return $i;
        }
    }
    return 0;   
}

?>