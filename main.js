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
	new Ammount("1ct", 25, 1), 
	new Ammount("2ct", 50, 2), 
	new Ammount("5ct", 80, 5),
	new Ammount("10ct", 300, 10), 
	new Ammount("20ct", 400, 20), 
	new Ammount("50ct", 250, 50),
	new Ammount("1€", 300, 100), 
	new Ammount("2€", 450, 200), 
	new Ammount("5€", 200, 500),
	new Ammount("10€", 100, 1000), 
	new Ammount("20€", 50, 2000), 
	new Ammount("50€", 20, 5000),
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