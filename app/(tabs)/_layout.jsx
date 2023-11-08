import { Tabs } from "expo-router"
import { Feather } from '@expo/vector-icons'; 

export default () => {
    return(
        <Tabs>
            <Tabs.Screen name={'Expense'} options={{
                tabBarActiveTintColor: '#0094C6',
                tabBarInactiveTintColor: 'grey',
                tabBarIcon: ({ focused}) => (
                    <Feather name={"trending-down"} size={24} color={focused ? '#0094C6' : 'grey'} />
                )
            }}/>
            <Tabs.Screen name={'Income'} options={{
                tabBarActiveTintColor: '#0094C6',
                tabBarInactiveTintColor: 'grey',
                tabBarIcon: ({ focused}) => (
                    <Feather name={"trending-up"} size={24} color={focused ? '#0094C6' : 'grey'} />
                )
            }}/>
        </Tabs>
    )
}