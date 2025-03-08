rabbitmqadmin declare exchange name="order_updates" type="fanout" durable="true" auto_delete="false" 
rabbitmqadmin declare queue name="order_updates_listener" durable="true" auto_delete="false" 
rabbitmqadmin declare binding source="order_updates" destination_type="queue" destination="order_updates_listener" 


