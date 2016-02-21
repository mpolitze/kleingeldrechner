/// <reference path="~\references.js" />

(function(){

$("a[href^='mailto:']").each(function () {
    var hash = md5($(this).attr('href').replace('mailto:', '').toLowerCase().trim());
    $('<img src="https://www.gravatar.com/avatar/' + hash + '?s=32&d=retro" class="avatar">').prependTo(this);
});

Handlebars.registerHelper("calc", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("newline", function() {  
    return "\n";
});

Handlebars.registerHelper("round", function(v) {  
    var x = ""+Math.floor(v);
	var d = ""+Math.floor((v*100) % 100);
	var zeros = "";
	for(var i=d.length; i<2; i++){
		zeros += "0";
	}
	return x+","+zeros+d;
});

var templates = {}; 
$("#templates>div").each(function(){
	var source = $(this).html();
	templates[$(this).attr('id')] = Handlebars.compile(source);
});

var configuration = [ 
	new Ammount("1ct", 40, 1), 
	new Ammount("2ct", 50, 2), 
	new Ammount("5ct", 70, 5),
	new Ammount("10ct", 150, 10), 
	new Ammount("20ct", 170, 20), 
	new Ammount("50ct", 90, 50),
	new Ammount("1€", 120, 100), 
	new Ammount("2€", 190, 200), 
	new Ammount("5€", 90, 500),
	new Ammount("10€", 75, 1000), 
	new Ammount("20€", 30, 2000), 
	new Ammount("50€", 16, 5000),
	new Ammount("100€", 1, 10000)
];

$('#configuration>form').empty();
$(templates.distributionForm({
	ammounts: configuration
})).appendTo('#configuration>form');

$("#calculator form").submit(function(e){
	e.preventDefault();
	
	$('#output>div').empty();
	$(templates.progressBar()).appendTo('#output>div');	
	
	var inputValue = Math.floor($(this).parent().find("input").val().replace(',','.') * 100);
		
	var worker = new Worker("worker.js");
	
	var workerDone = function(e){
		$('#output>div').empty();
		$(templates.distributionResult({
			ammounts: e.data.result,
			value: inputValue
		})).appendTo('#output>div');
		worker.removeEventListener('message', workerDone);
	};
	
	worker.addEventListener('message', workerDone);	
	
	worker.postMessage({
        cmd: 'calculate',
	    params: {
	        inputValue: inputValue,
	        configuration: configuration
	    }
	});
	
	return false;
});
})();
