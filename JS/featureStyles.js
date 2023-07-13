/** layers style are defined here
 * 
 */


var featureStyles=
{
		x:"test",
		

		 selectEuropa : new ol.style.Style({                            //comp  green
	        stroke: new ol.style.Stroke({
	            color: '#ff0000',
	            width: 2
	        }),
	        fill: new ol.style.Fill({

	            color: '#006400'

	        })
	        
	    }),


	    ipfeaturestyle : new ol.style.Style({                                //ip   orange color
	        stroke: new ol.style.Stroke({
	            color: '#ff0000',
	            width: 2
	        }),
	        fill: new ol.style.Fill({

	            color: '#FFA500'

	        })
	    }),
	    defaultStyle : new ol.style.Style({                              //default
	        stroke: new ol.style.Stroke({
	            color: '#808080',
	            width: 2
	        }),
	        fill: new ol.style.Fill({

	            color: 'rgba(0, 0, 255, 0.1)'

	        }),
	        text: new ol.style.Text({
	            font: 'bold 15px "Open Sans", "Arial Unicode MS", "sans-serif"',
	            placement: 'line',
	            fill: new ol.style.Fill({
	                color: 'yellow'
	            })
	        })
	    }),


	    selectStyle : new ol.style.Style({

	        stroke: new ol.style.Stroke({
	            color: '#00FFFF',
	            width: 2

	        }),
	        fill: new ol.style.Fill({
	            color: 'rgb(204, 238, 255)'

	        })


	    }),

	     pointStyle:new ol.style.Style({
	        image: new ol.style.Circle({
	            radius: 5,
	            stroke: new ol.style.Stroke({
	                color: 'white',
	                width: 2
	            }),
	            fill: new ol.style.Fill({

	                color:'red'
	            })


	        })
	            
	    }),
	    
	     textStylefunction : function (feature) {
	    	 var style;
	     
	         style = new ol.style.Style({
	             stroke:new ol.style.Stroke({
	                 color: '#FF0000',
	                 width: 3
	             }),
	            text: new ol.style.Text({
	                font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
	                placement: 'line',
	                fill: new ol.style.Fill({
	                    color: 'yellow'
	                })
	            })

	        });

	        style.getText().setText(feature.get('dname'));
	        return style;

	    },

   textStyleVillage : function (feature) {
	 var style;

    style = new ol.style.Style({
        stroke:new ol.style.Stroke({
            color: '#FF0000',
            width: 3
        }),
       text: new ol.style.Text({
           font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
           placement: 'line',
           fill: new ol.style.Fill({
               color: 'yellow'
           })
       })

   });

   style.getText().setText(feature.get('village'));
   return style;

},

 stylefunction : function (feature) {

    var status = feature.getProperties().status;             // feature.get('Status');
    if (status == 'comp') {
    	
        return this.selectEuropa;
        
    } else if (status == 'Pending') {

        return this.ipfeaturestyle;

    }
    else if (status == 'No') {
        return this.defaultStyle;


    }
    else {

        return this.defaultStyle;

    }


}
		
};
	
	
	
////////////////need to check

var textStyleMandal = function (feature) {
    var style;

     style = new ol.style.Style({
         stroke:new ol.style.Stroke({
             color: '#FF0000',
             width: 3
         }),
        text: new ol.style.Text({
            font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
            placement: 'line',
            fill: new ol.style.Fill({
                color: 'yellow'
            })
        })

    });

    style.getText().setText(feature.get('mname'));
    return style;

}

var textStylefunction3d = function (feature) {    //foreluru3d
    var style;

    style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#FF0000',
            width: 3
        }),
        text: new ol.style.Text({
            font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
            placement: 'line',
            fill: new ol.style.Fill({
                color: 'yellow'
            })
        })

    });
    if (feature.get('struct_id')) {
        style.getText().setText(feature.get('struct_id'));
    }
    else {
        style.getText().setText(" ");
    }
    
    return style;

}

	
	
	
