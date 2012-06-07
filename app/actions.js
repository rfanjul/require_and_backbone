
	/*
	 * Acciones comprar y vender
	 */
	var sellAction = Ext.create('Ext.Action', {
	    icon   : '../shared/icons/fam/delete.gif',  // Use a URL in the icon config
	    text: 'Sell stock',
	    disabled: true,
	    handler: function(widget, event) {
	        var rec = grid.getSelectionModel().getSelection()[0];
	        if (rec) {
	            alert("Sell " + rec.get('company'));
	        } else {
	            alert('Please select a company from the grid');
	        }
	    }
	});
	var buyAction = Ext.create('Ext.Action', {
	    iconCls: 'buy-button',
	    text: 'Buy stock',
	    disabled: true,
	    handler: function(widget, event) {
	        var rec = grid.getSelectionModel().getSelection()[0];
	        if (rec) {
	            alert("Buy " + rec.get('company'));
	        } else {
	            alert('Please select a company from the grid');
	        }
	    }
	});

	var contextMenu = Ext.create('Ext.menu.Menu', {
	    items: [
	        buyAction,
	        sellAction
	    ]
	});
