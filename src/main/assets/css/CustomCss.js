import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
      flex: 1, // 가로정렬 할때 사용함 , width 대신, %가능
      justifyContent: 'center', // 가로 정렬 왼쪽 flex-start 오른쪽 flex-end
      alignItems: 'center', // 세로 정렬
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#000000',
      marginBottom: 5,
    },
    marginButton : {
        marginBottom: 20,
    },
    cardh : {
        // height: 200,
    }
});
