$(document).ready(function($) {
    // converter object
    var converter = {
        jsonData: {}, // object to store the data from json
        converterData: { // object to manipulate convert data
            fromNum: 0
        },
        init: function() { // initiate the module
            this.bufferDom();
            this.readJson();
            this.bindEvents();
        },
        bufferDom: function() { // cache the jQuery DOM search to cut down memory usage
            this.$navPills = $('#nav_pills');
            this.$keyboard = $('#keyboard');
            this.$fromLabel = $('#from_label');
            this.$toLabel = $('#to_label');
            this.$fromNum = $('#from_num');
            this.$toNum = $('#to_num');
            this.$fromIcon = $('#convert_from_icon');
            this.$toIcon = $('#convert_to_icon');
        },
        bindEvents: function() { // bind front-end events events
            this.$keyboard.delegate('li', 'click', this.passValue.bind(this)); // keyboard interaction bind
            this.$navPills.delegate('li', 'click', this.getData.bind(this)); // update data when select different menu item
        },
        readJson: function() { // run a jQuerified ajax method to read JSON,
            $.getJSON( 'public/assets/currencies.json', {
                format: "json"
              })
                .done(function( data ) {
                    $.each( data, function( key, value ) {
                        var from_label = value.from_label,
                        to_label = value.to_label,
                        from_icon = value.from_icon,
                        to_icon = value.to_icon,
                        menu_label = value.menu_label;
                        ratio = value.ratio,
                        active = key === 0 ? 'class="active"' : '';

                        $( '<li '+ active +' id="' + from_label + '-'+ to_label + '" ' + // tho could use templating engines here Moustache-like etc
                        ' data-from-curr="'+ from_label +'"' +
                        ' data-to-curr="'+ to_label +'"' +
                        ' data-ratio="' + ratio + '" ' +
                        ' data-from-icon="' + from_icon + '" ' +
                        ' data-to-icon="'+ to_icon +'" '+ active +'>' +
                        menu_label +
                        '</li>'
                        ).appendTo('#nav_pills');
                    });

                    $('#convert_from_icon').attr('src', data[0]['from_icon']); //set up the initial data on load
                    $('#convert_to_icon').attr('src', data[0]['to_icon']);
                    $('#from_label').html(data[0]['from_label']);
                    $('#to_label').html(data[0]['to_label']);
                    this.converterData.activeRatio = data[0]['ratio']; // add initial rate
              }.bind(this));
        },
        passValue: function(event) { // keyboard interaction
            var keyVal = $(event.target).attr('data-value');
            var currentNum = this.$fromNum.attr('data-num');

            if (currentNum === '0' && keyVal !== 'del') { // pass value when the first char is input
                this.$fromNum.html(keyVal).attr('data-num', keyVal);
                this.converterData.fromNum = parseFloat(this.$fromNum.attr('data-num'));
                this.convert();
            } else if (currentNum === '0' && keyVal === 'del') { // stop propagation if trying to delete the 0 char
                return false;
            } else if (currentNum !=='0' && currentNum.length > 1 && keyVal === 'del') { // handle DELETE function
                this.$fromNum.html(currentNum.substr(0, currentNum.length - 1)).attr('data-num', currentNum.substr(0, currentNum.length - 1));
                this.converterData.fromNum = parseFloat(this.$fromNum.attr('data-num'));
                this.convert();
            } else if (currentNum !=='0' && currentNum.length == 1 && keyVal === 'del') { // reset the input when deletnig everything
                this.$fromNum.html(0).attr('data-num', 0);
                this.converterData.fromNum = 0;
                this.convert();
            } else { // on button click add value to the to-convert stack
                if (currentNum.length < 5) {
                    this.$fromNum.html(currentNum + keyVal).attr('data-num', currentNum + keyVal);
                    this.converterData.fromNum = parseFloat(this.$fromNum.attr('data-num'));
                    this.convert();
                }
            }
        },
        convert: function() { // do the math based on active ratio
            if (this.converterData.fromNum === 0) { // dont do the math with 0, its 0 anyway huh?
                this.$toNum.html(0).attr('data-num', 0);
            }else { // any other case do the math please and cut extra decimals
                this.$toNum.html((this.converterData.fromNum * this.converterData.activeRatio).toFixed(3))
                .attr('data-num', (this.converterData.fromNum * this.converterData.activeRatio).toFixed(3));
            }

        },
        getData: function(event) { // retrieve the data from the data attributes (could be done differently tho)
            this.activePill = $(event.target);
            this.converterData.activeRatio = this.activePill.attr('data-ratio'),
            this.converterData.toIcon = this.activePill.attr('data-to-icon'),
            this.converterData.fromIcon = this.activePill.attr('data-from-icon'),
            this.converterData.fromLabel = this.activePill.attr('data-from-curr'),
            this.converterData.toLabel = this.activePill.attr('data-to-curr');
            this.updateLabels(event.target);
            this.convert(); // updates according to a new rate when switch the menu item
        },
        updateLabels: function(elem) { // handle display of menu items, icons and labels
            this.activePill.addClass('active');
            this.$navPills.find('li').not(elem).removeClass('active').removeAttr('class');
            this.$fromLabel.html(this.converterData.fromLabel);
            this.$toLabel.html(this.converterData.toLabel);
            this.$fromIcon.attr('src', this.converterData.fromIcon);
            this.$toIcon.attr('src', this.converterData.toIcon);
        },
    }

    converter.init(); // lets roll
});

// note 1: I am not sure about cross-origin settings of the provided amazon bucket so decided to store JSON locally

// note 2: the module could be done using different patterns but it is not indicated we need to protect the methods and expose
// some API so I decided to go for a old good object literals
