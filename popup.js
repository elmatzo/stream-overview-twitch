/**
 * Created by matthias on 31.03.14.
 *
 */

var csgoApi = "https://api.twitch.tv/kraken/streams?game=Counter-Strike%3A%20Global%20Offensive&limit=10";
var dota2Api = "https://api.twitch.tv/kraken/streams?game=Dota%202&limit=10";
var sc2Api = "https://api.twitch.tv/kraken/streams?game=StarCraft%20II%3A%20Heart%20of%20the%20Swarm&limit=10";
var top10 = "https://api.twitch.tv/kraken/games/top?limit=13";

$(document).ready(function () {

        $('#cs').addClass("active");
        getData(csgoApi);

        document.getElementById('sc').addEventListener("click", function () {
            $('#dota, #cs, #other, #otherIn').removeClass("active");
            $('#sc').addClass("active");
            getData(sc2Api);
        });
        document.getElementById('dota').addEventListener("click", function () {
            $('#sc, #cs, #other, #otherIn').removeClass("active");
            $('#dota').addClass("active");
            getData(dota2Api);
        });
        document.getElementById('cs').addEventListener("click", function () {
            $('#dota, #sc, #other, #otherIn').removeClass("active");
            $('#cs').addClass("active");
            getData(csgoApi);
        });
        document.getElementById('other').addEventListener("click", function () {
            $('#dota, #cs, #sc, #otherIn').removeClass("active");
            $('#other').addClass("active");
            getData(top10);
        });
    }
);

function getData(twitchApi) {

    $("img").css("display", "block");

    var htmlStr = "";
    var first = true;

    $('#list').empty();

    if(twitchApi != top10)
    {
	    $.ajax({
	        dataType: "jsonp",
	        url: twitchApi
	    })
	
	        .done(function (data) {
	
                //var i=0;
                //var idHelperStr = twitchApi.substring(42,46);
                //console.log(idHelperStr);

	            $.each(data.streams, function (i,stream) {

                    /* STREAMING FOR?
                    var streamingFor = stream.channel.updated_at;
                    var localDate = 
                    console.log(streamingFor);
                    */

                    var status = stream.channel.status;

	                htmlStr += '<a id="'+i+'" target="_blank" href="' + stream.channel.url + '" data-toggle="tooltip" data-placement="top" title="'+status+'">';

                    if(first)
                    {
                        htmlStr += '<li id="first" class="list-group-item streams" style="background-image:url(' + stream.channel.logo + ');">';
                        first=false;
                    }
                    else
                    {
                        htmlStr += '<li class="list-group-item streams" style="background-image:url(' + stream.channel.logo + ');">';
                    }
                    htmlStr += stream.channel.display_name +
                        '<span>' + stream.viewers + '</span>' +
                        '</li></a>';
                    //i++;

	            });
	            $('#list').append(htmlStr);

                $("#0").attr("data-placement","bottom");
	            $("img").css("display", "none");
                $('[data-toggle=tooltip]').tooltip();
	        });
    }
    else
    {
        $.ajax({
            dataType: "jsonp",
            url: twitchApi
        })

            .done(function (data) {
            	
            	$.each(data.top, function(i,game){
            		
            		var gName = game.game.name;
            		
            		if(gName == "Dota 2" ||
            		   gName == "StarCraft II: Heart of the Swarm" ||
            		   gName == "Counter-Strike: Global Offensive");
            		else
            		    if(i == 0)
            		    {
            		        htmlStr += '<li id="first"'+' title="'+gName+'" class="list-group-item games" style="background-image:url('+ game.game.box.small +');">' +
                                    						gName + '<span>' + game.viewers + '</span>' +'</li>';
            		    }
            		    else
            		    {
            		        htmlStr += '<li class="list-group-item games"'+' title="'+gName+'" id="'+i+'" style="background-image:url('+ game.game.box.small +');">' +
                                    						gName + '<span>' + game.viewers + '</span>' +'</li>';
            		    }
            	});
            	$('#list').append(htmlStr);
            	$("img").css("display", "none");
            	
            	$(document).off("click",".games");
            	
            	$(document).on("click",".games",function(){
            		getOthers(event.target.id);
            	});

            });
    }
}

function getOthers(number)
{
    $('#otherIn').css("display","block");
	$('#otherIn').addClass("active");
    $('#dota, #cs, #other, #sc').removeClass("active");
	var x = '#'+number;
	var y = $(x).attr("title");
	var bla ="https://api.twitch.tv/kraken/streams?game=";
	for(var i=0;i<y.length;i++)
	{
		var c = y.charAt(i);
		if(c==' ')
			bla+="%20";
		else if(c==':')
			bla+="%3A";
		else
		{
			bla+=c;
		}
	}
	bla+="&limit=10";
	if(y.length>5)
	{
		$('#otherInA').html(y.substring(0,5).toUpperCase()+"...");
	}
	else
	{
		$('#otherInA').html(y.toUpperCase());
	}

    $(document).off("click","#otherIn");

	$(document).on("click","#otherIn",function(){
	    $('#otherIn').addClass("active");
        $('#dota, #cs, #other, #sc').removeClass("active");
		getData(bla);
	});

	getData(bla);
}
