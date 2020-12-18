var user_list = new Array();
var orderby = new Array("owner", "asc");
var User = /** @class */ (function () {
    function User(uid) {
        this.userid = uid;
        this.implants = new Array();
        this.selected = true;
        this.username = uid + "";
        this.access_token = "";
        this.location = "";
        for (var i = 0; i < 11; i++) {
            this.implants[i] = new Implant();
        }
        this.Make_Character_slot();
        this.getUserData();
    }
    User.prototype.getUserData = function () {
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                var name = JSON.parse(ESIdata.responseText);
                _this.username = name["name"];
                _this.getAccessToken();
            }
        };
        ESIdata.open("GET", "https://" + location.hostname + "/PublicESI/getname.php?type=character&id=" + this.userid, true);
        ESIdata.send();
    };
    User.prototype.getAccessToken = function () {
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                var token = JSON.parse(ESIdata.responseText);
                _this.access_token = token["access_token"];
                _this.Load_implants();
            }
        };
        ESIdata.open("GET", "https://" + location.hostname + "/PublicESI/DoYouHaveImplant/getaccesstoken.php?id=" + this.userid, true);
        ESIdata.send();
    };
    User.prototype.Load_implants = function () {
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                //alert(this.responseText);
                var implants_esi = JSON.parse(ESIdata.responseText);
                if (implants_esi.error === undefined) {
                    for (var i = 0; i < implants_esi.length; i++) {
                        _this.add_implants(implants_esi[i]);
                    }
                }
                _this.Display_Character_slot();
                _this.Load_location();
            }
        };
        ESIdata.open("GET", "https://esi.evetech.net/latest/characters/" + this.userid + "/implants/?datasource=tranquility", true);
        ESIdata.setRequestHeader("Content-Type", "application/json");
        ESIdata.setRequestHeader("Authorization", "Bearer " + this.access_token);
        ESIdata.send();
    };
    User.prototype.Load_location = function () {
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                //alert(this.responseText);
                var location_esi = JSON.parse(ESIdata.responseText);
                if (location_esi.error === undefined) {
                    _this.set_location(location_esi.solar_system_id);
                }
                _this.Display_Character_slot();
            }
        };
        ESIdata.open("GET", "https://esi.evetech.net/latest/characters/" + this.userid + "/location/?datasource=tranquility", true);
        ESIdata.setRequestHeader("Content-Type", "application/json");
        ESIdata.setRequestHeader("Authorization", "Bearer " + this.access_token);
        ESIdata.send();
    };
    User.prototype.add_implants = function (_typeid) {
        //{
        //    "itemname":"Ocular Filter - Standard",
        //    "typeid":10216,
        //    "slot":1,
        //    "attribute":"Perception",
        //    "point":4
        //}
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                //alert(this.responseText);
                var implants_esi = JSON.parse(ESIdata.responseText);
                _this.implants[implants_esi.slot] = new Implant(implants_esi.typeid, implants_esi.itemname, implants_esi.slot, implants_esi.attribute, implants_esi.point);
                _this.Display_Character_slot();
            }
        };
        ESIdata.open("GET", "./get_implant_info.php?typeid=" + _typeid, true);
        ESIdata.send();
    };
    User.prototype.set_location = function (location_id) {
        var _this = this;
        var ESIdata = new XMLHttpRequest();
        ESIdata.onreadystatechange = function () {
            if (ESIdata.readyState == XMLHttpRequest.DONE) {
                //alert(this.responseText);
                var location_esi = JSON.parse(ESIdata.responseText);
                _this.location = " @ " + location_esi.name;
                _this.Display_Character_slot();
            }
        };
        ESIdata.open("GET", "https://lindows.kr/PublicESI/getname.php?type=system&id=" + location_id, true);
        ESIdata.send();
    };
    User.prototype.Make_Character_slot = function () {
        this.div_character_slot = document.createElement("div");
        this.span_character_name = document.createElement("span");
        this.img_portrait = document.createElement("img");
        this.table_implants = document.createElement("table");
        this.img_portrait.className = "portrait";
        this.span_character_name.className = "username";
        this.span_character_name.innerHTML = this.username;
        this.table_implants.className = "implantTable";
        this.table_implants.insertRow();
        this.table_implants.insertRow();
        for (var i = 0; i < 10; i++) {
            this.table_implants.rows[0].insertCell();
            this.table_implants.rows[0].cells[i].className = "implantslot";
            this.table_implants.rows[1].insertCell();
            this.table_implants.rows[1].cells[i].className = "implantstat";
        }
        this.div_character_slot.appendChild(this.img_portrait);
        this.div_character_slot.appendChild(this.span_character_name);
        this.div_character_slot.appendChild(this.table_implants);
        return this.div_character_slot;
    };
    User.prototype.Display_Character_slot = function () {
        this.img_portrait.src = "https://images.evetech.net/characters/" + this.userid + "/portrait?size=64";
        this.span_character_name.innerHTML = this.username + this.location;
        var temp_noimplant = true;
        for (var i = 0; i < 10; i++) {
            var temp_implant_image = document.createElement("img");
            var temp_span_point = document.createElement("span");
            if (this.implants[i + 1].typeid != 0) {
                temp_implant_image.src = "https://images.evetech.net/types/" + this.implants[i + 1].typeid + "/icon";
            }
            else {
                temp_implant_image.src = "./images/gray_X.png";
            }
            if (this.implants[i + 1].point != 0) {
                temp_span_point.innerHTML = "+" + this.implants[i + 1].point;
            }
            while (this.table_implants.rows[0].cells[i].lastElementChild) {
                this.table_implants.rows[0].cells[i].removeChild(this.table_implants.rows[0].cells[i].lastElementChild);
            }
            while (this.table_implants.rows[1].cells[i].lastElementChild) {
                this.table_implants.rows[1].cells[i].removeChild(this.table_implants.rows[1].cells[i].lastElementChild);
            }
            this.table_implants.rows[0].cells[i].appendChild(temp_implant_image);
            this.table_implants.rows[1].cells[i].appendChild(temp_span_point);
        }
        for (var i = 1; i <= 5; i++) {
            if (this.implants[i].typeid > 0) {
                temp_noimplant = false;
            }
        }
        if (temp_noimplant) {
            this.span_character_name.className = "username0";
        }
        else {
            this.span_character_name.className = "username";
        }
    };
    return User;
}());
var Implant = /** @class */ (function () {
    function Implant(_typeid, _itemname, _slot, _attribute, _point) {
        if (_typeid === void 0) { _typeid = 0; }
        if (_itemname === void 0) { _itemname = ""; }
        if (_slot === void 0) { _slot = 0; }
        if (_attribute === void 0) { _attribute = ""; }
        if (_point === void 0) { _point = 0; }
        this.typeid = _typeid;
        this.itemname = _itemname;
        this.slot = _slot;
        this.attribute = _attribute;
        this.point = _point;
    }
    return Implant;
}());
function Read_Character(userid, username, token) {
    var i;
    for (i = 0; i < user_list.length; i++) {
        if (user_list[i].userid == userid) {
            return i;
        }
    }
    //console.log(username);
    user_list[i] = new User(userid);
    return i;
}
function _2digit(n) {
    var s = n + "";
    while (s.length < 2) {
        s = "0" + s;
    }
    return s;
}
function Display_user_list() {
    var list_table = document.createElement("table");
    list_table.className = "charlist";
    for (var i = 0; i < user_list.length; i++) {
        list_table.insertRow(-1);
        list_table.rows[i].insertCell(-1);
        list_table.rows[i].cells[0].appendChild(user_list[i].div_character_slot);
        list_table.rows[i].cells[0].className = "charlist";
    }
    var table_userlist = document.getElementById("userlist_table");
    while (table_userlist.lastElementChild) {
        table_userlist.removeChild(table_userlist.lastElementChild);
    }
    table_userlist.appendChild(list_table);
}
