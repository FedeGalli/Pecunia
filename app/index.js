import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';


WebBrowser.maybeCompleteAuthSession()


const StartPage = () => {
    
    const [userInfo, setUserInfo] = React.useState(null)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "66710878987-bhva8p50ljcih14pomoqgooa66pt581q.apps.googleusercontent.com",
        iosClientId: "66710878987-gmoifq0pubd8sjjq4cifmon7lg1qqe3p.apps.googleusercontent.com"
    })

    async function googleLogInHandler() {
        const user = await SecureStore.getItemAsync('user')
    
        if (user) {
            setUserInfo(JSON.parse(user))
        } else {
            if (response?.type === "success") {
                try {
                    const googleResponse = await fetch(
                        "https://www.googleapis.com/userinfo/v2/me",
                        {
                            headers: { Authorization: `Bearer ${response.authentication.accessToken}` }
                        }
                    )
                    const user = await googleResponse.json()
                    await SecureStore.setItemAsync('user', user)
                    setUserInfo(user)
                } catch (error) {
        
                }
            }

        }
    }

    React.useEffect( () => {
        googleLogInHandler()
    }, [response])

    return(
        
        <View>
            <Redirect href='/Expense' />
            <TouchableOpacity onPress={
                promptAsync
            }>
                <Text>Log in with G</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                await SecureStore.deleteItemAsync('user')
            }
            }>
                <Text>Delete User Info</Text>
            </TouchableOpacity>
            <Text>{userInfo}</Text>
        </View>

    )

}

export default StartPage