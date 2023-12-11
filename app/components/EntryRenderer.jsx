import { React } from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { router } from "expo-router"

const EntryRenderer = ({index, amount, category, timestamp, redirectType}) => {
    pathName = ''
    if (redirectType === 'expense') {
        pathName = '/expense_list/[expenseInfo]'
    } else if (redirectType === 'income') {
        pathName = '/income_list/[incomeInfo]'
    }
    return(
        <View>
            <TouchableOpacity onPress={() => {
                router.push({ pathname: pathName, params: { index: index, amount: amount, category: category, timestamp: timestamp }})
            }}>
                <Text style={{fontSize: 16}}>{index} {amount} {category}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EntryRenderer