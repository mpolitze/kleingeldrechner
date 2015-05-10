/// <reference path="~\references.js" />
(function () {
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/seedrandom.min.js');
    importScripts('ammount.js');

    var random = function (max) {
        return Math.floor(Math.random() * max);
    };

    Array.prototype.random = function () {
        return this[random(this.length)];
    };
    
    self.calculate = function (params) {
        var targetSum = params.inputValue;
        var configuration = params.configuration;
        var output = {};

        Math.seedrandom();
        var population = [];
        for (var i = 0; i < configuration.length; i++) {
            var ammount = configuration[i];
            for (var j = 0; j < ammount.count; j++) {
                population.push(ammount);
            }
        }

        while (targetSum > 0) {
            for (var i = 0; i < population.length; i++) {
                if (population[i].value > targetSum) {
                    population.splice(i, 1);
                    i--;
                }
            }

            var a = population.random();
            output[a.title] = output[a.title] || new Ammount(a.title, 0, a.value);
            output[a.title].count++;
            targetSum -= a.value;
        }

        var ammounts = [];
        for (var a in output) {
            ammounts.push(output[a]);
        }
        ammounts = ammounts.sort(function (a, b) {
            var xa = a.value;
            var xb = b.value;
            if (a.value > 200) {
                xa = a.value / 10000;
            }
            if (b.value > 200) {
                xb = b.value / 10000;
            }
            return (xb - xa);
        });

        return ammounts;
    };

    self.addEventListener('message', function (e) {
        if (typeof (self[e.data.cmd]) == 'function')
        {
            self.postMessage({
                cmd: e.data.cmd,
                result: self[e.data.cmd](e.data.params)
            });
        }
    });

})();