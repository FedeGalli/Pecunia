import { Tabs } from "expo-router"
import { Feather } from '@expo/vector-icons'; 

export default () => {
    return(
        <Tabs>
            <Tabs.Screen name={'Expense'} options={{
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'grey',
                tabBarIcon: ({focused}) => (
                    <Feather name={"trending-down"} size={24} color={focused ? 'red' : 'grey'} />
                )
            }}/>
            <Tabs.Screen name={'Income'} options={{
                tabBarActiveTintColor: '#33cc33',
                tabBarInactiveTintColor: 'grey',
                tabBarIcon: ({focused}) => (
                    <Feather name={"trending-up"} size={24} color={focused ? '#33cc33' : 'grey'} />
                )
            }}/>
        </Tabs>
    )
}