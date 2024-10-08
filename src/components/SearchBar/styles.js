import { StyleSheet } from "react-native";

export default StyleSheet.create({
    searchIcon: { //boton buscador
        marginRight: 8,
      },
  
      searchContainer: {  // contenedor de boton y buscador
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1, // Solo para Android
  
      },
  
      searchInput: { //texto dentro del buscador
        flex: 1,
        fontSize: 16,
        color: '#212529',
      },
})