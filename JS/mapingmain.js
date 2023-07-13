//working on main5.5js for deoindex5 
// changes in new property.
/****changes done for creating and adding features*/

var jstsGeom = {};
var selectFeat;
var map;
var object;
var UniqueObjectId  ;
var vector;
var draw; // global so we can remove it later
var utilityLayer;

var localityLayer;
var defaultStyle;
var ipfeaturestyle;
var pointStyle;

//var selectEuropa;
var krishnayyapalem;
var updateValuesArrayObject = [];
var eluru3dLayer;
var ap_boundaryLayer;
var ap_dist_boundaryLayer;
var mandal_boundaryLayer;
var village_boundaryLayer;





var lpsVillage_bnd_Url;
var Krishnayapalem_Url;
var Utility_Url  ;


$(document).ready(function () {
    
	
	
	jqvalidateValues();
 
    //Layers creations starts ********************
	lpsVillage_bnd_Url=ServiceUrl.vectorLayer("LPSVillages","APCRDA");
	 Krishnayapalem_Url =ServiceUrl.vectorLayer("krishnayapalemv1","APCRDA");
	 Utility_Url  =ServiceUrl.vectorLayer("krishnayyapalem_utility","APCRDA");
	

 
	
     var bingMapsAerial = new ol.layer.Tile({
        visible:true,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AhOpRvafzbHsBw2tIH2t5t7L1skJaeCLYu5vt08i-cp55suM6VmEQifUO6GzfRjj',//'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
            imagerySet: 'Aerial',
        })
    });
     
   
      utilityLayer= new ol.layer.Vector({
         source: new ol.source.Vector({       
             url:"JS/Point.geojson",
             format: new ol.format.GeoJSON(            

         )
            
         })
      });


      krishnayyapalem = new ol.layer.Vector({              
          source: new ol.source.Vector({

              url:"JS/India.json",
              format: new ol.format.GeoJSON(

          )

          })
      });    
      
     
   
    //Layers creations ends ********************
     

   // creating map starts *************************  
    
      map = new ol.Map({
          target: 'map',
          layers: [bingMapsAerial,krishnayyapalem, utilityLayer
          ],
          view: new ol.View({
              center: ol.proj.fromLonLat([80.55127, 16.49219]),                                                                      //78.4767, 17.3898 for hyd
              zoom: 15
          }),
         
          controls: ol.control.defaults({
              attribution: false,

          }).extend([new ol.control.ScaleLine])
      });
       
   
   
     
     var mousePosition = new ol.control.MousePosition({
         coordinateFormat: ol.coordinate.createStringXY(5),
         projection: 'EPSG:4326',
         target: document.getElementById('coords'), 
         undefinedHTML: '&nbsp;'
     });
     
     map.addControl(mousePosition);
     
   
    // creating map code ends *************************  


  
    //to select the features


    selectFeat = new ol.interaction.Select({
    	layers: [krishnayyapalem]
    	
    });

    map.addInteraction(selectFeat);
    
    
       
    selectFeat.on('select', function (e) {

        e.selected.forEach(function (e) {
            object = e;
            count = 0;
            var feature = e.getProperties();
            console.log(feature);
            var uniqueId = feature.gisid;
           var polyGeometry = e.getGeometry();    //to get geometry   ***********************   
         
         //  $('#txt_scttureid').val(feature.struct_id);  
          // $('#pltno').text(uniqueId);
           $('#pltArea').text(feature.ADMIN);
           $("#id_city").text("COUNTRY");
          
        //   if(feature.fid !=null)
        //	   {
        	   
        	  console.log();
        	   
        	   if(feature.geometry.B.length >2)
        	   {  
        		   
        		   $("#benDtlDlg").dialog({
                       position: { my: "right top", at: "right top", of: "#map" }
        		   
        		   })

            	   
            	 }
        	/*   else if(feature.geometry.B.length == 2)
        	   {
            		   
            		   $("#utilitylDlg").dialog({
                           position: { my: "right top", at: "right top", of: "#map" } 
            		   
            		   })
            	 }   */
        		   
        	//   }     
           
           
           var parser = new jsts.io.OL3Parser();                               
           jstsGeom = parser.read(polyGeometry);         //for split need to change the polygeometry to jsts
   
     
        });
    })

    //select feature ends*******************


    //addpoint, add poly and dropdown code 
  
    $("#AddPolygon").click(function () {
       // alert("poly");
        var drawinterTestPoly = new ol.interaction.Draw({

            layers: krishnayyapalem,
            type: 'Polygon'
            
        })

        map.addInteraction(drawinterTestPoly);
        
        drawinterTestPoly.on("drawend", function (e) {           
           var polyGeometry = e.feature;  
           var parserjson = new ol.format.GeoJSON({
               defaultDataProjection: 'EPSG:4326'
           });
           var featuresGeoJSON = parserjson.writeFeature(e.feature);
           var feature = parserjson.readFeature(featuresGeoJSON, {
               dataProjection: 'EPSG:3857',
               featureProjection: 'EPSG:4326'
           }); 
           var corrdinate = '';

           for (var i = 0; i < feature.getGeometry().B.length ; i++) {

               corrdinate += feature.getGeometry().B[i] + " " + feature.getGeometry().B[i + 1]+ ", ";
               i = i + 1;
           }

           corrdinate = corrdinate.replace(/,\s*$/, "");
           console.log(corrdinate);
			var features = krishnayyapalem.getSource().getFeatures(); 
         
           var UniqueObjectId = maxObjectId(features);
           UniqueObjectId = UniqueObjectId + 1;
           polyGeometry.set('objectid', UniqueObjectId);
           krishnayyapalem.getSource().addFeature(e.feature);   
      
           drawinterTestPoly.setActive(false);
        })      
    
    })   
    

    $("#addpoint").click(function () {    
      
    	 geometryTools.addPoint(utilityLayer);
          
        
        })


     

    
    
    $("#Deselect").click(function () {                //to deselect  present not working this tool

        draw.setActive(false);

    })

    //split functionality code starts here

    $("#split").click(function () {

        if (selectFeat.getFeatures().getLength() > 0) {

            selectFeat.setActive(false);
            drawinterTest = new ol.interaction.Draw({

                layers: [krishnayyapalem],
                type: 'LineString'

            })

            map.addInteraction(drawinterTest);


            drawinterTest.on("drawend", function (e) {
               

                console.log(e.feature.getGeometry());
                
                lineGeometry = e.feature.getGeometry();

                drawinterTest.setActive(false);


                var parser = new jsts.io.OL3Parser();                                  //2
                jstsLineGeom = parser.read(lineGeometry);


                var polygons = split(jstsGeom, jstsLineGeom);
                
                if(!polygons){
                	
                	 selectFeat.setActive(true);
                	 return;
                	
                }


                else if (polygons.array_.length < 2) {

                        alert("Split polygon task couldn't complete");
                        selectFeat.setActive(true);
                        return;

                    }
                	
                	else {


                        for (var i = polygons.iterator() ; i.hasNext() ;) {
                            var parserjson = new ol.format.GeoJSON({
                                defaultDataProjection: 'EPSG:4326'

                            });
                            var polygon = i.next();
                            var feature = new ol.Feature(parser.write(polygon));



                            var featuresGeoJSON = parserjson.writeFeature(feature);
                            
                            var newFeature = parserjson.readFeature(featuresGeoJSON, {
                                dataProjection: 'EPSG:3857',
                                featureProjection: 'EPSG:4326'
                            });


                            var cooardinates = getCooardinates(newFeature);

                            var features = krishnayyapalem.getSource().getFeatures();


                            //     var UniqueObjectId = features.length + 1;
                            var UniqueObjectId = maxObjectId(features);
                            UniqueObjectId = UniqueObjectId+1;
                            var jsonObj = {};
                            jsonObj.fid = UniqueObjectId;
                            jsonObj.gisid = UniqueObjectId;
                            jsonObj.coordinates = cooardinates;
                            jsonObj.epsg = 4326;
                            var postValuesurl = ServiceUrl.service+"InsertKrishnpalemFrGeom";                       //krishnayyapalem
                            postValues(postValuesurl, jsonObj);

                            feature.set('gisid', UniqueObjectId);
                            krishnayyapalem.getSource().addFeatures([feature]);
                          //  krishnayyapalem.setStyle(stylefunction);
                           
                            selectFeat.setActive(true);

                        }


                    
                	
                }


            });





        }
        else {

            alert("Please select one polygon");
            return false;
        }


    });


    //split functionality code ends here

    //export map pdf  tool  
    $("#PrintPDF").click(function () {  

        var dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148]
        };

        map.once('postcompose', function (event) {
            console.log(event);
            var canvas = event.context.canvas;
            var data = canvas.toDataURL('image/jpeg');
           
            var pdf = new jsPDF('landscape', undefined, dims.a2);
            pdf.addImage(data, 'JPEG', 0, 0, 297, 210);
            pdf.save('map.pdf');


        })

     })

    /*       update values for poly starts here           */


   


    //submit values at the end 

    $("#sub_val").click(function () {

     
    		
    		 var url = ServiceUrl.service+"insertStructValues";
             
    	        var updateLayer = "krishnayapalemv1";
    	        var uniqueId = 0;
    	        var hillFeatures = krishnayyapalem.getSource().getFeatures();
    	        for (var i = 0; i < hillFeatures.length; i++) {

    	            if (obj.struct_id == hillFeatures[i].getProperties().struct_id) {

    	                uniqueId = hillFeatures[i].getProperties().gisid;

    	                hillFeatures[i].setStyle(ipfeaturestyle);

    	            }

    	        }
    	      
    	        for (var i = 0; i < updateValuesArrayObject.length; i++) {

    	            postValues(url, updateValuesArrayObject[i]);     //build1@05Sep
    	          
    	          clearValues();      	         

    	        }
    	       

    	        addStatus(uniqueId, updateLayer, 'Pending', updateValuesArrayObject.structureArea, updateValuesArrayObject.noOfFloors); // updateValuesArrayObject[1].noOfFloors,
    	        $("#middle_div").hide(); //after submitting values hide the div  @9Sep2019 
    	        $("#table_id tbody").empty();
    	        updateValuesArrayObject=[];  //to clear object once submit the values  //build1@09Sep
    		
    	    	
       
    }) 

  //build1@6thSep removed button approve
    
    

    /* update polygon values /sending values to database end here    */

    $("#lyr").click(function () {
       
        $("#dialog").dialog({
            position: { my: "right top", at: "right top", of: "#map" }


        });
    })    
 

    $("#formdetails").click(function () {

        $("#upload1").slideToggle('slow');

    })

    $("#grid").click(function () {

        $("#table_id").slideToggle('slow');

    })




    $(document).on("blur", "#dataTable1 tbody tr td:nth-child(3) input", function () {
    	
       
        if ($(this).val().length > 0) {

            getDataFrmDb($(this).val());
            $(this).closest("tr").find('td:eq(3) input').val("NA").attr('disabled', true);
            $(this).closest("tr").find('td:eq(4) input').val("NA").attr('disabled', true);
            $(this).closest("tr").find('td:eq(5) input').val("NA").attr('disabled', true);
            $(this).closest("tr").find('td:eq(7) input').val("NA").attr('disabled', true);

        }


    })

    $(document).on("blur", "#dataTable1 tbody tr td:nth-child(4) input", function () {

        if ($(this).val().length > 0) {

            getDataFrmDb($(this).val());
            $(this).closest("tr").find('td:eq(2) input').val("NA").attr('disabled', true);
            $(this).closest("tr").find('td:eq(4) input').attr('placeholder', 'Nil');
            $(this).closest("tr").find('td:eq(5) input').attr('placeholder', 'Nil');
            $(this).closest("tr").find('td:eq(6) input').val("NA").attr('disabled', true);

        }


    })  
   
   

    $('#table_id tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
     //   alert('You clicked on ' + data[0] + '\'s row');
        alert(data);
        console.log(data);
        sel_status_Polygon(data[0]);
    });


    $('input[type=radio][name=dim123]').on('change', function () {

        if ($(this).val() == '3D') {


            $("#accordion").hide();
            $("#div_3d").show();
        
            map.getView().setCenter(ol.proj.fromLonLat([81.08063, 16.70927]));
           
           // ol3d.setEnabled(true);

        } else if ($(this).val() == '2D') {
        
            $("#accordion").show();
            $("#div_3d").hide();
            // ol3d.setEnabled(false);
            map.getView().setCenter(ol.proj.fromLonLat([80.55127, 16.49219]));
        }

    });  
   
    $('input[type=radio]').change(function () {
      
     
        var tbl = "<tbody>";
    
        if ($(this).val() == "ptinnumber") {

        
            $('#upload_3dtbl').html("");
            
            tbl += "<tr><td>PTinNo :</td><td><input type='text' class='form-control'></td></tr>";
                   
                tbl += "<tr><td>Property Type:</td><td> <input type='text' id='txt_plntArea' class='form-control' value='Residential'/></td></tr>";
                tbl += "<tr><td>Plinth Area :</td><td><input type='text' class='form-control'></td></tr>";
                tbl += "<tr><td>Tax Collected :</td><td><input type='text' class='form-control'></td></tr>";
                tbl += "</tbody>";
            
            
                console.log(tbl);

                $('#upload_3dtbl').append(tbl);

        } else if ($(this).val() == "tinnumber") {

         
            $('#upload_3dtbl').html("");
           
            tbl += "<tr><td>TinNo :</td><td><input type='text' class='form-control'></td></tr>";
            tbl += "<tr><td>Labour License :</td><td><input type='text' class='form-control'></td></tr>";
            tbl += "<tr><td>GST :</td><td><input type='text' class='form-control'></td></tr>";    
            tbl += "<tr><td>Property Type:</td><td> <input type='text' id='txt_plntArea' class='form-control' value='Commercial'/></td></tr>";
            tbl += "<tr><td>Plinth Area :</td><td><input type='text' class='form-control'></td></tr>";
            tbl += "<tr><td>Tax Collected :</td><td><input type='text' class='form-control'></td></tr>";
            tbl +="</tbody>";
            
            
            console.log(tbl);

            $('#upload_3dtbl').append(tbl);
        };
      
    });

    $("#btn_saveDtls").click(function (e) {
       
        $("#middle_div").show();
       
    })

    $("#upd_val").click(function () {

        var structureId = $("#txt_scttureid").val();

        console.log(structureId);

        if (structureId == "") {

            alert("please select StructureId");


        } else {


            var count = 0;

            obj = getValuesforPostData();
            updateValuesArrayObject.push(obj);



            $("#table_id").append("<tr><td>" + obj.struct_id + "</td><td>" + obj.ptin + "</td><td>" + obj.labourLicense + "</td><td>" + obj.gstno + "</td><td>" + obj.own_name + "</td><td>" + obj.floor_no + "</td><td>" + obj.landusetyp + "</td><td>" + obj.pl_area + "</td></tr>");
             clearValues();
            $("#middle_div").show();
            addArea();
            updateValuesArrayObject.structureArea = $("#txt_totalArea").val();
            updateValuesArrayObject.noOfFloors = $("#txt_nofloors").val();
        }

    });
    //for drop down property type@05thSep
    $("#residential_drp").on("change", function () {

        if (this.value == "Utilities") {

            $("#utilitydtls").show();
            $("#propertydtls").hide();

        } else {
            $("#propertydtls").show();
            $("#utilitydtls").hide();

        }


    })

    $("#btn_saveNewPro").click(function(){
    	
    	$("#drp_state").val($("#drp_state_new").val());    	 
    	$("#drp_muncipality").val($("#drp_muncipality_new").val());
    	$("#cir_drdn").val($("#cir_drdn_new").val());
    	$("#locality_drdn").val($("#locality_drdn_new").val());    	 
    	
    	
    	
    })
    
   $('input[type=checkbox]').change(function(){
	   
	   if($(this).prop("checked")){
		   
		  layersOn($(this).val());
		   
		  
	   }
	   else if($(this).prop("checked")==false){
		   
		   layerOff($(this).val());
		   
	   }
	   
   })
    	//post new utility values 
    	
    $("#btn_saveUtility").click(function(){
    	
    
    		var utiltySerUrl=ServiceUrl.service +'insertUtilityValues';
    		
    	var utilittyObj={
    			
    			 "utilitytype": $('#drp_utlitytype_id option:selected').text(),
    		       "dep_utility_id": $('#Utility_id').val(),
    		        "locality":  $('#id_utl_locality').val(),  
    	           "loc_code": "000",
    		       "material": $('#id_material').val(),  
    		       "gisid":$('#txt_uniqid').val(),  
    		       "status":$('#id_utl_roadname').val(),  
    		       "landusetype": $('#residential_drp option:selected').text(),  
    		       "state": $('#drp_state_new option:selected').text(),
    		       "muncipality":  $('#drp_muncipality_new option:selected').text(),
    		       "circle":  $('#cir_drdn_new option:selected').text(),
    		       "ward":  $('#locality_drdn_new option:selected').text(),
    		       "sublocality": $('#id_utl_subloca').val(),   
    		       "landmark":  $('#id_utl_landmark').val(), 
    		       "roadname":$('#id_utl_roadname').val(),  
    		       "city":$('#id_utl_city').val(),   
    		       "pincode":$('#id_utl_pincode').val()   
    			
    	}
    	postValuesAjax(utiltySerUrl,utilittyObj);    	
    	console.log(utilittyObj);
    })
    
   


	
    
    

});   //end of document.ready   ******************************************************************************









/*    //addpoint, split,add poly and dropdown codes  ends  **************************/

var split = function (poly, line) {

try{
	
	var a = poly; var b = line;


    var union = a.getBoundary().union(b);


    var polygonizer = new jsts.operation.polygonize.Polygonizer();

    polygonizer.add(union);
    var polygons = polygonizer.getPolygons();
    console.log(polygons);

    return polygons;
	
	
}catch(err){
	
	alert("Split Task Could not be completed");
    return false;
	
}
	
    
};




function setEnabled() {

    ol3d.setEnabled(!ol3d.getEnabled())


}

function layersOn(layerName){
    	
    	switch(layerName){
    	
    	case "stateLayer":
    	 map.addLayer(ap_boundaryLayer);    	 
	//	 map.getView().fit(ap_boundaryLayer.getSource().getExtent(),map.getSize());
    	break;
    	case "districtLayer":
       	 map.addLayer(ap_dist_boundaryLayer);    	 
   	//	 map.getView().fit(ap_dist_boundaryLayer.getSource().getExtent(),map.getSize());
       	break;
       	
    	case "mandalLayer":
       	 map.addLayer(mandal_boundaryLayer);    	 
   	//	 map.getView().fit(mandal_boundaryLayer.getSource().getExtent(),map.getSize());
       	break;
    	case "villageLayer":
          	 map.addLayer(village_boundaryLayer);    	 
     // 		 map.getView().fit(village_boundaryLayer.getSource().getExtent(),map.getSize());
          	break;
    	case "revenueLayer":
          	 map.addLayer(revenue_boundaryLayer);    	 
      //		 map.getView().fit(revenue_boundaryLayer.getSource().getExtent(),map.getSize());
          	break;
    	case "parliamentLayer":
          	 map.addLayer(parliament_boundaryLayer);    	 
      	//	 map.getView().fit(parliament_boundaryLayer.getSource().getExtent(),map.getSize());
          	break;   	 
    	
    	case "panchayatLayer":
         	 map.addLayer(panchayat_boundaryLayer);    	 
     	//	 map.getView().fit(panchayat_boundaryLayer.getSource().getExtent(),map.getSize());
         	break;
   	 
   	}
    	
    	
    }

function layerOff(layerName){
	
	switch(layerName){
	
	case "stateLayer":
	 map.removeLayer(ap_boundaryLayer);    	 
	
	break;
	case "districtLayer":
   	 map.removeLayer(ap_dist_boundaryLayer);	 
		 
   	break;   	
	case "mandalLayer":
   	 map.removeLayer(mandal_boundaryLayer);	 
		
   	break;
	case "villageLayer":
	   	 map.removeLayer(village_boundaryLayer);	 
			
	   	break;
	case "revenueLayer":
	   	 map.removeLayer(revenue_boundaryLayer);	 
			
	   	break;
	case "parliamentLayer":
	   	 map.removeLayer(parliament_boundaryLayer);	 
			
	   	break;
	case "panchayatLayer":
	   	 map.removeLayer(panchayat_boundaryLayer);	 
			
	   	break;
	 
	}
	
	
}

	

//to select ip/comp polygon based on on click on table

function sel_status_Polygon(uniqueId) {


    var krishnayapalemFeatures = krishnayyapalem.getSource().getFeatures();
    

    krishnayapalemFeatures.forEach(function (feature) {

        if (parseInt(uniqueId) == feature.getProperties().gisid) {

            map.getView().fit(feature.getGeometry().getExtent(), map.getSize());


        }


    })



}




function postValuesAjax(url, obj) {

    $.ajax({
        type: "POST",
        url: url,
        data: obj,
        success: function (e) {
            alert('Values submitted successfully');
            console.log(e);
        }
    });




}



function hidedivs() {
   // alert("hi");

    var landusetype = $("#land_drp  option:selected").text();

    if (landusetype == "Utility") {

        $("#center-div2").hide();
        $("#center-div3").show();

    }
    else {
        $("#center-div3").hide();
        $("#center-div2").show();

    }


}


//ading point to wfs layer to database along with unique id generation from layer max id




var stylefunction = function (feature) {

    var status = feature.getProperties().status;             // feature.get('Status');
    if (status == 'comp') {
        return featureStyles.selectEuropa;
    } else if (status == 'Pending') {

        return ipfeaturestyle;

    }
    else if (status == 'No') {
        return defaultStyle;


    }
    else {

        return defaultStyle;

    }


}



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

function getValFromSelction(selFeature) {

    try {

        $("#txt_ptinno").val(selFeature.ptin);
        $("#txt_assessmnt").val(selFeature.assessment);
        $("#txt_flrNo").val(selFeature.floor_no);
        $("#txt_flatno").val(selFeature.flat_no)
        $("#txt_flrtype").val(selFeature.floor_type);
        $("#txt_occName").val(selFeature.own_name);
        $("#txt_occuno").val(selFeature.occ_no);      //phnumber and adhar number need to add
        $("#txt_aadhar").val(selFeature.aadharno);

        $("#txt_phno").val(selFeature.phno);
        $("txt_flrtype").val(selFeature.floor_type);
        $("#txt_plotarea").val(selFeature.pl_area);
        $("#txt_sanitary").val(selFeature.sanitary);
        $("#txt_toilet").val(selFeature.toilet);

        //  $("#txt_eletricno").val(selFeature.ele);    need to add in to service
        $("#txt_poltid").val(selFeature.plot_id);
        $("#txt_plntArea").val(selFeature.pl_area);     

        //for point
        $("#drp_utility  option:selected").text(selFeature.category);
        $("#txt_utiliyid").val(selFeature.gisid);
        $("#txt_ut_Locality").val(selFeature.locality);
        $("#txt_material").val(selFeature.material);
        $("#txt_lndmark").val(selFeature.name);

    } catch (e) {


    }


   

}

function getValuesforPostData() {     //for posing values to database

    var userValues = {};
    var floorAreaFrmField = 0;
   
    var ptin="";
 //   var labourLicense="";
 //   var gst="";
   
    //getting values for DB

    var villageName = $("#locality_drdn  option:selected").text();    //villagename
    var structureId = $("#txt_scttureid").val();
    var landusetype = $("#id_landuse  option:selected").text();
    var ptinNo = parseInt($("#txt_ptinno").val());
    var labourLicense = $("#txt_lbrls").val();
    var gst = $("#txt_gst").val();
    var ownername = $("#txt_occName").val();
    var occupantNo = $("#txt_occuno").val();
    var aadharnumber = $("#txt_aadharno").val();
    var phonenumber = $("#txt_phno").val();
    var flatNo = $("#txt_flatno").val()
    var floorNo = $("#txt_flrNo option:selected").text();
    var floortype = "Marble";             $("#txt_flrtype").val();
    var plinthArea = parseFloat($("#txt_plntArea").val());
    var sanitary = "Yes";             $("#txt_sanitary").val();
    var toilet =  "Yes";              $("#txt_toilet").val();  //need to add eletricity
    var plotid = $("#txt_poltid").val();
    var taxAmount = $("#txt_taxcal").val();
    var subStructUniAddress = structureId + "/" + floorNo;
   // var structureArea = $("#txt_totalArea").val();
 //   var noOfFloors = $("#txt_nofloors").val();
    //getting values for field 

    $("#dataTable1 tbody tr").each(function () {                                   //to get the floor details 

        var floorField = $(this).find('td:eq(1) option:selected').text();
    
        console.log(landusetype);
        if (floorNo == floorField) {

            switch (landusetype) {
                case "Residential":
                    alert(landusetype);
                    floorAreaFrmField = $(this).find('td:eq(6) input').val();
                    alert(floorAreaFrmField);
                    subStructUniAddress += "/" + "Res";
                //    labourLicense = 'NA';
                  //  gst = 'NA';

                    break;
                case "Commercial":
                  //  alert(landusetype);

                        floorAreaFrmField = $(this).find('td:eq(7) input').val();
                        subStructUniAddress += "/" + "comm";
                        labourLicense = $(this).find('td:eq(4) input').val();
                        gst = $(this).find('td:eq(5) input').val();
                    break;
               
            }           

        }
    })


    userValues = {
        "landusetyp": landusetype,
        "ptin": ptinNo,
       "villageName":villageName,    //need to add in database to get this value
        "flat_no": flatNo,
        "floor_no": floorNo,
        "floor_type": floortype,
        "occ_no": occupantNo,
        "own_name": ownername,
        "labourLicense": labourLicense,
        "gstno":gst,
        "pl_area": plinthArea,
        "sanitary": sanitary,
        "toilet": toilet,
        "struct_id": structureId,
        "plot_id": plotid,
        "aadharno": aadharnumber,
        "phno": phonenumber,
        "taxamount": taxAmount,
      //  "gisid": gisid,
        "status": "Pending",
        "floorareafield": floorAreaFrmField,
       
        "struct_uniadress": subStructUniAddress,
      
    }

    return userValues;
};



function getPointvalPostData() {

    var userValues = {};

    var landusetype = $("#land_drp  option:selected").text();  // landuse is utility type
  
    var utilityid = parseInt($("#txt_utiliyid").val());    //pole id
    var gisid = parseInt($("#txt_uniqid").val());

    var category = $("#drp_utility  option:selected").text();       //nameof the uility is category

    var utilityid = parseFloat($("#txt_utiliyid").val());
    var locality = $("#txt_ut_Locality").val();
    var material = $("#txt_material").val();






    userValues = {


        "gisid": gisid,
        "id": utilityid,           //utility id
        "category": category, // //nameof the uility is category
        "landusetype": landusetype,
        "locality": locality,
        "material": material,
        "layerName": "krishnayyapalemUtility",
        "status": "comp"
    }

    return userValues;
};

function clearValues() {

    $("#txt_ptinno").val("");
    $("#txt_uniqid").val("");
    $("#txt_name").val(" ");
    $("#txt_area").val("");
    $("#txt_landmark").val("");
    $("#txt_plotarea").val(" ");
    $("#txt_plntArea").val(" ");
    $("#txt_assessmnt").val(" ");
    $("#txt_flatno").val(" ");
    $("#txt_flrNo").val(" ");
    $("#txt_flrtype").val(" ");
    //    $("#txt_taxcal").val("");
    $("#txt_poltid").val(" ");

    $("#txt_occName").val(" ");
    $("#txt_occuno").val(" ");
    $("#txt_aadharno").val(" ");
    $("#txt_phno").val(" ");
    $("#txt_sanitary").val(" ");
    $("#txt_toilet").val(" ");
    $("#drp_state").val(0);
    $("#drp_muncipality").val(0);
    $("#ward_drdn").val(0);
    $("#land_drp").val(0);        //need to check
    $('#txt_eletricno').val(" ");

    $("#drp_utility").val(0); //utilty drop down
    $("#txt_utiliyid").val(" ");    //will go in to pole id

    $("#txt_utiliyhgt").val(" ");
    $("#txt_material").val(" ");
    $("#txt_lndmark").val(" ");
    
    $("#txt_lbrls").val(" ");    //labour license
    $("#txt_gst").val(" ");      //gst   drp_occutype,inputCity1,inputState1,txt_taxcal,inputZip1,id_landuse
    $("#drp_occutype").val(0);    //occutype
    $("#inputCity1").val(" ");    //city
    $("#inputState1").val(0);    //Statedrp
    $("#txt_taxcal").val(" ");   //tax
    $("#inputZip1").val(" ");   //zip   
    $("#id_landuse").val(0);    //landusedrop down
    $("#residential_drp").val(0);  //residentail floor type
}
function postValues(url,jsondata) {                      //build1@05Sep
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


function getDataFrmDb(ptin) {                              //build1@05Sep    
    
    var muncipalvalurl = getValuesFrmMuncipalDb_url + '/'+"'"+ ptin+"'";

    $.ajax({
        type: 'GET',
        url: muncipalvalurl,

        success: function (getData) {
            //  console.log(getData.$values);
            if (getData.length > 0) {
                getValFromSelction(getData[0])
            }
            else {

                alert("Ptin /Tin number is not available,please Enter Details");
               // clearValues();
                $("#txt_ptinno").val(ptin);
                return;
            }

        }
    });


}



//function which are not using 

function addInteraction(value) {
   
    var draw;    

    if (value !== 'None') {


        if (value == "Point") {

            var id;
            draw = new ol.interaction.Draw({
                source: pointVector.getSource(),
                type: value
                //geometryFunction:function(coordinates){

                //    console.log(coordinates);
                //}

            });

            map.addInteraction(draw);

            draw.on("drawend", function (e) {

                console.log(e);
                var feature = e.feature;
                var coordinate = feature.getGeometry();
                var coor = coordinate.B;
                var id = addPointToWfsLayer(coor);
                $('#txt_uniqid').val(id);

            });







        } else if (value == "Polygon") {

            draw = new ol.interaction.Draw({
                source: vector.getSource(),
                type: value
            });
            map.addInteraction(draw);

            draw.on("drawend", function (e) {

                console.log(e);
            })
        }

    }
}


    //split function implementation
    var splitfunction = function () {
   
        selectFeat.setActive(false);

        var drawinterTest = new ol.interaction.Draw({

            layers: [vector],
            type: "LineString"
            //maxPoints: 2
        })

        map.addInteraction(drawinterTest);

        drawinterTest.on("drawend", function (e) {

          //  console.log(vector.getSource());

            console.log(e.feature.getGeometry());
            lineGeometry = e.feature.getGeometry();
            drawinterTest.setActive(false);
      
            var parser = new jsts.io.OL3Parser();
            var jstsLineGeom = parser.read(lineGeometry);
         
       
            var polygons = split(jstsGeom, jstsLineGeom);
            //    object.setGeometry(parser.write(buffer123.array_[0]));
            //    vector.getSource().addFeature(newFeatures);
            //  
            for (var i = polygons.iterator() ; i.hasNext() ;) {
                var polygon = i.next();
                var feature = new ol.Feature(parser.write(polygon), null, { strokeColor: 'gray', strokeWidth: 5, fillColor: 'white' });
                vector.getSource().addFeatures([feature]);
          
                console.log(fkt);   
            }

            selectFeat.setActive(true);
        })
    };

   



    function addRow(tableID) {

        var table = document.getElementById(tableID);

        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
       
        var colCount = table.rows[0].cells.length;
         var count=0
        for (var i = 0; i < colCount; i++) {

            var newcell = row.insertCell(i);

            newcell.innerHTML = table.rows[1].cells[i].innerHTML;
            //alert(newcell.childNodes);
            switch (newcell.childNodes[0].type) {
                case "text":
                    newcell.childNodes[0].value = "";
                    newcell.childNodes[0].id = "test" + count;
                    break;
                case "checkbox":
                    newcell.childNodes[0].checked = false;
                    break;
               
            }
            count++;
        }
       // $('#' + tableID + ' tbody').append($('#' + tableID + ' tbody tr:eq(0)').html());
        $('#' + tableID + ' tbody tr:last input').removeAttr("disabled");

    }



    function addRow1(tableID) {

        $('#'+tableID+' tbody').append($('#'+tableID+' tbody tr:eq(0)').html());
        $('#'+tableID+' tbody tr:last input').removeAttr("disabled");
    }

    function deleteRow(tableID) {
        try {
            var table = document.getElementById(tableID);
            var rowCount = table.rows.length;

            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i];
                var chkbox = row.cells[0].childNodes[0];
                if (null != chkbox && true == chkbox.checked) {
                    if (rowCount <= 1) {
                        alert("Cannot delete all the rows.");
                        break;
                    }
                    table.deleteRow(i);
                    rowCount--;
                    i--;
                }


            }
        } catch (e) {
            alert(e);
        }
    }


//calculate structure area 
    function addArea() {

       

            var totalArea = 0;

            $("#dataTable1 tbody tr").each(function () {

                var area = 0;
                var x = ($(this).find('td:eq(6) input').val());

                if ($(this).find('td:eq(2) input').val() != 'NA') {



                    area += $(this).find('td:eq(6) input').val();


                } else if ($(this).find('td:eq(3) input').val() != 'NA') {


                    area += $(this).find('td:eq(7) input').val();

                }




                totalArea += parseInt(area);

            })

            $("#txt_totalArea").val(totalArea);



    }



    function addStatus(plotId, layer, status, str_Area, str_noOfFlrs) {
        var plotcode = plotId;
        
        var ajaxUrl = ServiceUrl.geoserverHost+"geoserver/wfs";

        var XMLInsertHeaderString = '<wfs:Transaction service="WFS" version="1.0.0" ' +
    
        'xmlns:APCRDA="http://164.100.132.98:8080/geoserver/APCRDA" ' +   
         'xmlns:ogc="http://www.opengis.net/ogc" ' +
         'xmlns:wfs="http://www.opengis.net/wfs">' +
        '<wfs:Update typeName="APCRDA:'+layer+'">' +                 //    '<wfs:Update typeName="APCRDA:muncipalitypolylayer">' +
          '<wfs:Property>' +
          '<wfs:Name>status</wfs:Name>' +
          '<wfs:Value>' + status + '</wfs:Value>' +
          
           ' </wfs:Property>' +
            '<wfs:Property>' +
          '<wfs:Name>pl_area</wfs:Name>' +
          '<wfs:Value>' + str_Area + '</wfs:Value>' +
           ' </wfs:Property>' +

            '<wfs:Property>' +

          '<wfs:Name>nooffloors</wfs:Name>' +
          '<wfs:Value>' + str_noOfFlrs + '</wfs:Value>' +                 //adding floors to the layer

           ' </wfs:Property>' +

        '<ogc:Filter>' +
          '<ogc:FeatureId fid="' + plotcode + '"/>' +
        '</ogc:Filter>' +
      '</wfs:Update>' +
    '</wfs:Transaction>';
  
   


        $.ajax({
            url: ajaxUrl, data: XMLInsertHeaderString, type: 'POST', contentType: "application/xml", dataType: "xml", success: function (response) {
                console.log(response)
            }, error: function (xhr, ajaxOptions, thrownError) { console.log(xhr.status); console.log(thrownError); }
        });


    }

    

    function addFeatures(feature12) {

        var ajaxUrl = ServiceUrl.geoserverHost+"geoserver/wfs";
        // var ajaxUrl = 'http://localhost:8085/geoserver/APCRDA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=APCRDA:gannavaram1&maxFeatures=10000&outputFormat=application%2Fjson';
        $.ajax({
            url: ajaxUrl, data: feature12, type: 'POST', contentType: "application/xml", dataType:'xml', success: function (response) {
                console.log(response)
            }, error: function (xhr, ajaxOptions, thrownError) { console.log(xhr.status); console.log(thrownError); }
        });




    }

    






    var displayFeatureInfo =function(pixel){

        var features=[];
        map.getFeaturesAtPixel(pixel, function (feature) {
            features.push(feature);
          //  alert(features.values_.OBJECTID);
        
        });

  
    }

   

    

    var getTextLocality =function (feature){
        var text = feature.getProperties().LOC_NAME;

       
        return text;
    
    }



  

   

    function maxObjectId(array) {

        return Math.max.apply(Math, array.map(function (o) { return o.H.gisid; }))

    }


   

    function getCooardinates(feature) {


        var corrdinate = '';

        for (var i = 0; i < feature.getGeometry().B.length ; i++) {

            corrdinate += feature.getGeometry().B[i] + " " + feature.getGeometry().B[i + 1] + ", ";
            i = i + 1;
        }

        corrdinate = corrdinate.replace(/,\s*$/, "");
        console.log(corrdinate);

        return corrdinate;


    }
    
    function jqvalidateValues(){
    	
   	 $("#registerform").validate({
   			
   			rules:{
   				state:{
   					required:true,
   					min :"01"
   					
   				},
   				muncipality:{
   					required:true,
   					min:"01"
   					
   				},
   				circle:{
   					required:true,
   					min:"01"
   					
   				},
   				ward:{
   					required:true,
   					min:"01"
   				},
   				propertyType:{
   					required:true,
   					min:"01"
   					
   				},
   				uniqueID:{
       				
       				required:true
       			},
       			plotNumber:{
   				required:true
   				
   				
   			},
   			nooffloors:{
   				
   				required:true
   				
   			},
   			plotlength:{
   				
   				required:true
   			},
   			plotWidth:{
   				
   				required:true
   			},
   			
   			plotArea:{
   				
   				required:true
   			}
   			
   			
   			
   				
   			},
   			messages:{
   				
   				
   				state:{
   					min:"Plese Select State"
   				},
   				
   				muncipality:{
   					
   					min:"Please Select Muncipality"
   					
   				},
   				circle:{
   					
   					min:"Plese Select Circle"
   					
   				},
   				ward:{
   					
   					min:"Please Select Ward"
   				},
   				propertyType:{
   					
   					min:"Please Select Property Type"
   					
   				},
   				plotNumber:{
   					
   					required:"Plot number is required"
   					
   				},uniqueID:{
       				
       				required:"Please Select MapId"
       			}
   				
   					
   				
   			},  
   			errorElement: "em",
				errorPlacement: function ( error, element ) {
					// Add the `help-block` class to the error element
				//	error.addClass( "help-block" );
					error.addClass("error1");

					// Add `has-feedback` class to the parent div.form-group
					// in order to add icons to inputs
					element.parents( ".col-sm-5" ).addClass( "has-feedback" );

					if ( element.prop( "type" ) === "checkbox" ) {
						error.insertAfter( element.parent( "label" ) );
					} else {
						error.insertAfter( element );
					}

					
				},
   			
   			
   			submitHandler: function () { // for demo
   				updateNewProperty();
   			 //   alert('valid form submitted'); // for demo
   			    return false; // for demo
   			}
   				
   		});          
   	
   }
   
    
    
    function updateNewProperty(){   	

	    
    	var url=serviceurl.service+'updatenewproperty';   	    	
       
    	        
    		var fid =parseInt($("#txt_uniqid_hsm").val());
    		var state =$("#drp_state_hsm option:selected").text();
    		

    		
  var newPropertyObject =
  {	
		  
		  fid:fid,
		  state:state,
		  muncipality:$("#drp_muncipality_hsm option:selected").text(),
		  circle:$("#cir_drdn_hsm option:selected").text(),
		  ward:$("#locality_drdn_hsm option:selected").text(),
		  landusetype:$("#residential_drp_hsm option:selected").text(),
		 
		  plotnumber:$("#id_ptno_hsm").val(),
		  buildingname:$("#id_bldname_hsm").val(),		
		  locality:$("#id_localty_hsm").val(),
		  sublocality:$("#id_sublocalty_hsm").val(),
		  roadname:$("#id_roadnm_hsm").val(),		 
		  plotarea:parseFloat($("#id_pltArea_hsm").val())
		  
  }; 
  
 
  var stringObject=JSON.stringify(newPropertyObject);  
  
  $.ajax({
      url: url,
      method: 'POST',
      data: stringObject,
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      
      success: function (data) {
    	  console.log(data);
          alert("success");
          clearValues = true;
          console.log("success",data);
         alert("data submitted successfully ");
  
      } ,
      error:function(e){
    	  
    	  console.log(e);
    	  alert("data submitted successfully");
    
      }
    
          
      
  }); 
	
  clearValuesOfUpdateProperty();
	  



}
    
  function clearValuesOfUpdateProperty(){  //to clear updatenew property values 
    	
    	$("#drp_state_hsm").val("0");    	 
    	$("#drp_muncipality_hsm").val("0");
    	$("#cir_drdn_hsm").val("0");
    	$("#locality_drdn_hsm").val("0"); 	 
    	$("#residential_drp_hsm").val("0"); 	
    	
    	
      $("#id_ptno_hsm,#id_bldname_hsm,#id_localty_hsm,#id_sublocalty_hsm,#id_roadnm_hsm,#id_pltArea_hsm").val('')
    	
    	
    	
    }

  
    