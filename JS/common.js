/**
 * 
 */

 var ServiceUrl={
		
		 "geoserverHost" : "http://localhost:8085/", // "http://bhunaksha.ap.gov.in:8080/",
		 "service" : "htt://localhost:8086/Spring_REST/", //"https://bhunaksha.ap.gov.in/ptax/" ,
		"apwmsLayersUrl": 'http://localhost:8085/geoserver/APCRDA/wms?', //"http://bhunaksha.ap.gov.in/geoserver/APCRDA/wms?", 
    	  "geoserverServiceStringOne":"geoserver/APCRDA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=",    	
		 "geoserverServiceStringTwo":"&maxFeatures=30000&outputFormat=application%2Fjson",
		
		 
		  muncipalService: function(Servicename){
			 
			 return this.service+Servicename;
		 },	 
			 
		 vectorLayer :function(layerName,workspace){
			 
			return this.geoserverHost+this.geoserverServiceStringOne+workspace+":"+layerName+this.geoserverServiceStringTwo;   //function for layers hosting
		 }	 
		
}
 
 var geometryTools={
		 
		 addPointToWfsLayer: function(coordinate,layer){				
			 
			  var coord = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');		    

			    var lon = coord[0];
			    var lat = coord[1];
			   
			    var features = layer.getSource().getFeatures();

			    var Id = features.length;
			 
			   var UniqueObjectId = Id + 1;		   

			    var jsonObj = {};
			    jsonObj.fid = UniqueObjectId;
			    jsonObj.gisid = UniqueObjectId;
			    jsonObj.latitude = lat;             
			    jsonObj.longitude = lon;               
			    jsonObj.epsg = 4326;
			    jsonObj.layerName='krishnayyapalemUtility'
			    var postValuesurl = ServiceUrl.service+"insertUtilityGeom";
			    this.postValues(postValuesurl, jsonObj);			
			    return UniqueObjectId;
			 
		 },
		 

		
		 addPoint:function(pointLayer){
			 
	                  var that =this;
			 
			  var drawinterTestPoint = new ol.interaction.Draw({

		            layer: pointLayer,
		            type: 'Point'

		        });
		        map.addInteraction(drawinterTestPoint);

		        drawinterTestPoint.on("drawend", function (e) {        

		            var polyGeometry = e.feature;
		            var coordinate = polyGeometry.getGeometry();
		           var coor = coordinate.B;
		            map.removeInteraction(drawinterTestPoint);
		            
			        var id = that.addPointToWfsLayer(coor,pointLayer);
			         
			           $("#Utility_id").val(id);
			            $("#txt_uniqid").val(id);  
			            polyGeometry.set('gisid', id);
			            pointLayer.getSource().addFeature(polyGeometry); 
		          
		        });
		     
		 },
		 
		  postValues : function(url,jsondata) {                    
			  
				var data=JSON.stringify(jsondata);
				    $.ajax({
				        type: "POST",
				        url: url,
				        data: data,
				        contentType: "application/json; charset=utf-8",
				        success: function (e) {
				           alert('Geometry inserted in to database');
				            console.log(e);
				        },error: function (error) {
				             alert(error.responseText);
				         }
				    });



				}
		 
		
 }






 
 