/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial Software License 
Agreement provided with the Software or, alternatively, in accordance with the terms contained in a written agreement 
between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/

var win,index=0;

Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', 'ext/examples/ux');

Ext.require([
    'Ext.tip.QuickTipManager',
    'Ext.container.Viewport',
    'Ext.layout.*',
    'Ext.form.Panel',
    'Ext.form.Label',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.selection.*',
    'Ext.ux.layout.Center',
		
		//tabs
		'Ext.tab.Panel',
		'Ext.ux.TabCloseMenu',
		//grind
		'Ext.Action',
		'Ext.grid.*',
	  'Ext.data.*',
	  'Ext.util.*',
	  'Ext.state.*',
	  
		//windows
		'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border',
		
		//graph
		'Ext.chart.*',
		'Ext.layout.container.Fit'
		
]);

//
// This is the main layout definition.
//
Ext.onReady(function(){
		/*
		 *
		 */
			
    Ext.tip.QuickTipManager.init();

    // This is an inner body element within the Details panel created to provide a "slide in" effect
    // on the panel body without affecting the body's box itself.  This element is created on
    // initial use and cached in this var for subsequent access.
    var detailEl;

    // Gets all layouts examples
    var layoutExamples = [];
   
		Ext.Object.each(getBasicLayouts(), function(name, example) {
        layoutExamples.push(example);
    });
   
    Ext.Object.each(getCombinationLayouts(), function(name, example){			
        layoutExamples.push(example);
    });
    
    Ext.Object.each(getCustomLayouts(), function(name, example){			
        layoutExamples.push(example);
    }); 
	
 	 // sample static data for the store

   /**
    * Custom function used for column renderer
    * @param {Object} val
    */
   function change(val) {
       if (val > 0) {
           return '<span style="color:green;">' + val + '</span>';
       } else if (val < 0) {
           return '<span style="color:red;">' + val + '</span>';
       }
       return val;
   }

   /**
    * Custom function used for column renderer
    * @param {Object} val
    */
   function pctChange(val) {
       if (val > 0) {
           return '<span style="color:green;">' + val + '%</span>';
       } else if (val < 0) {
           return '<span style="color:red;">' + val + '%</span>';
       }
       return val;
   }
	
					
	/*
	 *  Accciones sobre el grid
	 * 
	 */
	var sellAction = Ext.create('Ext.Action', {
        icon   : 'ext/examples/shared/icons/fam/delete.gif',  // Use a URL in the icon config
        text: 'Sell stock',
        disabled: true,
        handler: function(widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (rec) {
                //alert("Sell " + rec.get('currency'));
								windowAction(rec,"Sell");
            } else {
                alert('Please select a currency from the grid');
            }
        }
    });
    var buyAction = Ext.create('Ext.Action', {
        icon   : 'ext/examples/shared/icons/fam/add.gif',
        text: 'Buy stock',
        disabled: true,
        handler: function(widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (rec) {
                //alert("Buy " + rec.get('currency'));
								windowAction(rec,"Buy");
            } else {
                alert('Please select a currency from the grid');
            }
        }
    });

    var contextMenu = Ext.create('Ext.menu.Menu', {
        items: [
            buyAction,
            sellAction
        ]
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columnLines: true,
        columns: [

            {
                text     : 'currency',
                flex     : 1,
                sortable : false,
                dataIndex: 'currency'
            },
            {
                text     : 'Bid : Venta',
                width    : 75,
                sortable : true,
                renderer : change,
                dataIndex: 'Sell'
            },
            {
                text     : 'Ask : Compra',
                width    : 75,
                sortable : true,
                renderer : change,
                dataIndex: 'Buy'
            },
						 {
	                text     : 'High',
	                width    : 75,
	                sortable : true,
	                renderer : 'usMoney',
	                dataIndex: 'High'
	            },
	            {
	                text     : 'Low',
	                width    : 75,
	                sortable : true,
	                renderer : 'usMoney',
	                dataIndex: 'Low'
	            },
            {
                text     : '% Change',
                width    : 75,
                sortable : true,
                renderer : pctChange,
                dataIndex: 'pctChange'
            },
            {
                text     : 'Last Updated',
                width    : 85,
                sortable : true,
               // renderer : Ext.util.Format.dateRenderer('m/d/Y'),
                dataIndex: 'Last'
            }
        ],/*
        dockedItems: [{
            xtype: 'toolbar',
            items: [
                buyAction, sellAction
            ]
        }],*/
        viewConfig: {
            stripeRows: true,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
								itemdblclick: function(view, rec, node, index, e) {
                    addTab(graph);
                }
            }
        },       
        title: 'Action Grid',
        stateful: false
    });

   grid.getSelectionModel().on({
       selectionchange: function(sm, selections) {
           if (selections.length) {
               buyAction.enable();
               sellAction.enable();
           } else {
               buyAction.disable();
               sellAction.disable();
           }
       }
   });

	/* pestañas */
	window.tabs = Ext.createWidget('tabpanel', {
	        id: 'content-panel',
					//renderTo: 'tabs1',
	        activeTab: 0,
	        defaults :{
	            //bodyPadding: 10
	        },
	        items: [grid,graph()]
				 
	});
	
	var contentPanel = {       
	     region: 'center', // this is what makes this panel into a region within the containing layout
	     layout: 'card',
	     margins: '2 5 5 0',
	     activeItem: 0,
	     border: false,
	     items: [tabs]
	};

	var leftPanel  = {       
	     region: 'center', // this is what makes this panel into a region within the containing layout
	     layout: 'card',
	     margins: '2 5 5 0',
	     activeItem: 0,
	     border: false,
	     items: [lastOperations,activeOperations]
	};
	
	var lastOperations = Ext.create('Ext.grid.Panel', {
	        store: storeLastOperations,
	        stateful: true,
	        stateId: 'stateGrid',
	        columns: [
	            {
	                text     : 'Company',
	                flex     : 1,
	                sortable : false,
	                dataIndex: 'company'
	            },
	            {
	                text     : 'Price',
	                width    : 75,
	                sortable : true,
	                renderer : 'usMoney',
	                dataIndex: 'price'
	            },
	            {
	                text     : 'Change',
	                width    : 75,
	                sortable : true,
	                renderer : change,
	                dataIndex: 'change'
	            },
	            {
	                text     : '% Change',
	                width    : 75,
	                sortable : true,
	                renderer : pctChange,
	                dataIndex: 'pctChange'
	            },
	            {
	                text     : 'Last Updated',
	                width    : 85,
	                sortable : true,
	                renderer : Ext.util.Format.dateRenderer('m/d/Y'),
	                dataIndex: 'lastChange'
	            },
	            {
	                xtype: 'actioncolumn',
	                width: 50,
	                items: [{
	                    icon   : '../shared/icons/fam/delete.gif',  // Use a URL in the icon config
	                    tooltip: 'Sell stock',
	                    handler: function(grid, rowIndex, colIndex) {
	                        var rec = store.getAt(rowIndex);
	                        alert("Sell " + rec.get('company'));
	                    }
	                }, {
	                    getClass: function(v, meta, rec) {          // Or return a class from a function
	                        if (rec.get('change') < 0) {
	                            this.items[1].tooltip = 'Hold stock';
	                            return 'alert-col';
	                        } else {
	                            this.items[1].tooltip = 'Buy stock';
	                            return 'buy-col';
	                        }
	                    },
	                    handler: function(grid, rowIndex, colIndex) {
	                        var rec = store.getAt(rowIndex);
	                        alert((rec.get('change') < 0 ? "Hold " : "Buy ") + rec.get('company'));
	                    }
	                }]
	            }
	        ],
	
	        title: 'Array Grid',
	   
	        viewConfig: {
	            stripeRows: true
	        }
	    });
	var activeOperations = 		Ext.create('Ext.grid.Panel', {
			        store: storeActiveOperations,
			        stateful: true,
			        stateId: 'stateGrid',
			        columns: [
			            {
			                text     : 'Company',
			                flex     : 1,
			                sortable : false,
			                dataIndex: 'company'
			            },
			            {
			                text     : 'Price',
			                width    : 75,
			                sortable : true,
			                renderer : 'usMoney',
			                dataIndex: 'price'
			            },
			            {
			                text     : 'Change',
			                width    : 75,
			                sortable : true,
			                renderer : change,
			                dataIndex: 'change'
			            },
			            {
			                text     : '% Change',
			                width    : 75,
			                sortable : true,
			                renderer : pctChange,
			                dataIndex: 'pctChange'
			            },
			            {
			                text     : 'Last Updated',
			                width    : 85,
			                sortable : true,
			                renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			                dataIndex: 'lastChange'
			            },
			            {
			                xtype: 'actioncolumn',
			                width: 50,
			                items: [{
			                    icon   : '../shared/icons/fam/delete.gif',  // Use a URL in the icon config
			                    tooltip: 'Sell stock',
			                    handler: function(grid, rowIndex, colIndex) {
			                        var rec = store.getAt(rowIndex);
			                        alert("Sell " + rec.get('company'));
			                    }
			                }, {
			                    getClass: function(v, meta, rec) {          // Or return a class from a function
			                        if (rec.get('change') < 0) {
			                            this.items[1].tooltip = 'Hold stock';
			                            return 'alert-col';
			                        } else {
			                            this.items[1].tooltip = 'Buy stock';
			                            return 'buy-col';
			                        }
			                    },
			                    handler: function(grid, rowIndex, colIndex) {
			                        var rec = store.getAt(rowIndex);
			                        alert((rec.get('change') < 0 ? "Hold " : "Buy ") + rec.get('company'));
			                    }
			                }]
			            }
			        ],
			       
			        title: 'Array Grid',
			       
			        viewConfig: {
			            stripeRows: true
			        }
			    });
	// contedor graficas
	var graphsPanel = {
	    id: 'details-panel',
	    title: 'Operaciones abiert',
	    region: 'center',
	    //bodyStyle: 'padding-bottom:15px;background:#eee;',
///	    autoScroll: true,
	    html: '<p class="details-info">When you select a layout from the tree, additional details will display here.</p>'
	};
	
	// Finally, build the main layout once all the pieces are ready.  This is also a good
	// example of putting together a full-screen BorderLayout within a Viewport.
  Ext.create('Ext.Viewport', {
      layout: 'border',
      title: 'Quorra.es :: Fx',
      items: [{
          xtype: 'box',
          id: 'header',
          region: 'north',
          html: '<h1> Quorra.es </h1>',
          height: 30
      },
			leftPanel, 
      contentPanel
      ],
      renderTo: Ext.getBody()
  });
});

function windowAction(rec,action){
	/*
   * Formulario de compra de divisisas
   *
   */

	 var formPanel = Ext.create('Ext.form.Panel', {
       frame: true,
       title: action +' :: '+rec.get("currency"),
       width: 340,
       bodyPadding: 5,
			 
       fieldDefaults: {
           labelAlign: 'left',
           labelWidth: 90,
           anchor: '100%'
       },

       items: [
				{
          xtype: 'textfield',
          name: 'Coste',
					fieldLabel: 'Ratio actual',
          value: rec.get(action)

        },
				{
           xtype: 'textfield',
           name: 'amount',
           fieldLabel: 'Inversion deseada',
           value: '100'
        }
			 ]
   });
	
	if (!win) {
    win = Ext.create('widget.window', {
            title: 'Layout Window',
            closable: true,
            closeAction: 'hide',
            width: 300,
            minWidth: 300,
            height: 200,
            layout: 'border',
            bodyStyle: 'padding: 5px;',						
            items:{
                region: 'center',
                xtype: 'tabpanel',
                items: [ formPanel ]
            }
        });
    
     //button.dom.disabled = true;
     if (win.isVisible()) {
         win.hide(this, function() {
            // button.dom.disabled = false;
         });
     } else {
         win.show(this, function() {
             // button.dom.disabled = false;
         });
     }
	}
}

/*
 *
 */
function addTab(){
	tabs.add({
		title: 'New Tab ',
	  iconCls: 'tabs',
		items:[graph()]
	}).show();
}

function graph(){
	var graphName= "graph_"+index;
	var pieStoreInfo= "pieStoreInfo_"+index;
	var pieChart= "pieChart_"+index;
	var gridStoreInfo= "gridStoreInfo_"+index;
	var gridStoreInfo= "gridStoreInfo_"+index;
	
	index++;
	/*
	 * graph
	 */
	var pieModel = [
	    {
          name: 'data1',
          data: 10
      },
      {
          name: 'data2',
          data: 10
      },
      {
          name: 'data3',
          data: 10
      },
      {
          name: 'data4',
          data: 10
      },
      {
          name: 'data5',
          data: 10
      }
  ];
	
  var pieStoreInfo = Ext.create('Ext.data.JsonStore', {
      fields: ['name', 'data'],
      data: pieModel
  });

	var pieChart = Ext.create('Ext.chart.Chart', {
     width: 100,
     height: 100,
     animate: false,
     store: pieStoreInfo,
     shadow: false,
     insetPadding: 0,
     theme: 'Base:gradients',
     series: [{
         type: 'pie',
         field: 'data',
         showInLegend: false,
         label: {
             field: 'name',
             display: 'rotate',
             contrast: true,
             font: '9px Arial'
         }
     }]
  });

  var gridStoreInfo = Ext.create('Ext.data.JsonStore', {
     fields: ['name', 'data'],
     data: pieModel
  });


			
	var gridInfo = Ext.create('Ext.grid.Panel', {
      store: gridStoreInfo,
      height: 130,
      width: 480,
      columns: [
          {
              text   : 'name',
              dataIndex: 'name'
          },
          {
              text   : 'data',
              dataIndex: 'data'
          }
      ]
   });
	
	var graphName = Ext.create('widget.panel', {
      height: 200,
      title: 'Line Chart',
      
      layout: 'fit',
      items: [{
          xtype: 'chart',
          animate: true,
          shadow: true,
          store: store1,
          axes: [{
              type: 'Numeric',
              position: 'left',
              fields: ['data1'],
              title: false,
              grid: true
          }, {
              type: 'Category',
              position: 'bottom',
              fields: ['name'],
              title: false
          }],
          series: [{
              type: 'line',
              axis: 'left',
              gutter: 80,
              xField: 'name',
              yField: ['data1'],
              tips: {
                  trackMouse: true,
                  width: 580,
                  height: 170,
                  layout: 'fit',
                  items: {
                      xtype: 'container',
                      layout: 'hbox',
                      items: [pieChart, gridInfo]
                  },
                  renderer: function(klass, item) {
                      var storeItem = item.storeItem,
                          data = [{
                              name: 'data1',
                              data: storeItem.get('data1')
                          }, {
                              name: 'data2',
                              data: storeItem.get('data2')
                          }, {
                              name: 'data3',
                              data: storeItem.get('data3')
                          }, {
                              name: 'data4',
                              data: storeItem.get('data4')
                          }, {
                              name: 'data5',
                              data: storeItem.get('data5')
                          }], i, l, html;

                      this.setTitle("Information for " + storeItem.get('name'));
                      pieStoreInfo.loadData(data);
                      gridStoreInfo.loadData(data);
//                        grid.setSize(480, 130);
                  }
              }
          }]
      }]
   });

	return graphName;
}