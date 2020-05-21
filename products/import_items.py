import csv
from . models import Item, Size, Category

def import_items():
	with open('pizza-menu.csv', 'r') as f:
		reader = csv.reader(f)
		next(reader)
		# Loop over reader line
		for index, line in enumerate(reader):
			item = Item.objects.get_or_create(id=line[0])
			item = item[0]
			item.name = line[1]
			# Check and update item price
			if line[5] != '':					
				item.price = line[5]
			else:
				item.price = None	
			# Check and update item category		
			if line[2] != '':
				cat = Category.objects.get_or_create(name=line[2])
				item.category = cat[0]
			else:
				item.category = None	
			# Check and update item size		
			if line[4] != '':
				size = Size.objects.get_or_create(size=line[4])
				item.size = size[0]
			else:
				item.size = None
			# Option check and update
			if line[3] != '':
				item.toppings = line[3]
			else:
				item.toppings = None
			item.save()