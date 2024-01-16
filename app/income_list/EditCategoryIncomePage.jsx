import { React } from "react"
import { Stack, useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import { FlatList } from 'react-native-gesture-handler'
import CategoryEditRenderer from "../components/CategoryEditRenderer";


const EditCategoryIncomePage = () => {
    const {cat} = useLocalSearchParams()

    return (
        <View>
            <Stack.Screen options={{
                headerTitle: 'Edit Expense Category'
            }} />


            <FlatList
                data={JSON.parse(cat)}
                renderItem={({ item }) => <CategoryEditRenderer name={item.name} index={item.index} redirectType={'income'}/>}
                keyExtractor={(item) => item.index}

            />
        </View>
    )
}

export default EditCategoryIncomePage