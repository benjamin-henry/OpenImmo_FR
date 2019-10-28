import SearchableDropdown from 'react-native-searchable-dropdown';
import { Component } from 'react';

class AddressSuggestor extends Component {
    constructor(props){
        super(props);

        this.state = {
            reqAddresses: [],
            dropdownContent: [],
            selectedItems: [],
            textData: '',
        }
    }

    render() {
        return (
            <SearchableDropdown
                style={{
                zIndex: 2000, borderWidth:1, borderRadius:10, width:Dimensions.get('window').width-18,
                }}
                multi={true}
                selectedItems={this.state.selectedItems}
                onItemSelect={(item) => {
                    // const items = this.state.selectedItems;
                    // items.push(item)
                    // this.setState({ selectedItems: items });
                }}
                containerStyle={{ padding: 5 }}
                onRemoveItem={(item, index) => {
                    // const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                    // this.setState({ selectedItems: items });
                }}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: '#ddd',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                    width:Dimensions.get('window').width-26,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,  
                    elevation: 5
                }}
                itemTextStyle={{ color: '#222' }}
                itemsContainerStyle={{
                    maxHeight: 140,
                    width:Dimensions.get('window').width-26,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,  
                    elevation: 5 }}
                items={this.state.dropdownContent}
                chip={false}
                resetValue={false}
                textInputProps={
                    {
                    placeholder: "Adresse",
                    underlineColorAndroid: "transparent",
                    style: {
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        width:Dimensions.get('window').width-26,
                        backgroundColor: 'rgba(255,255,255,.95)',
                        color: 'black',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 3,  
                        elevation: 5
                    },
                    onTextChange: (text) => {
                        this.getAddressFromApi(text);
                        this.setState({textData: text});
                        }
                    }
                }
                listProps={
                {
                    nestedScrollEnabled: true,
                }
                }
            />
        )
    }

    _onTextChanged() {

    }

    async getAddressFromApi(req) {
        if (req == ""){this.setState({reqAddresses: [],dropdownContent : []})}
        try {
            let response = await fetch(
            "https://api-adresse.data.gouv.fr/search/?q="+req,
            );
            let responseJson = await response.json();
            // console.log(responseJson.features);
            if (req){
            console.log('///////'+req+'////////');
            try {
                this.setState({reqAddresses: [],dropdownContent : []})
                let idx = 0;
                responseJson.features.forEach(element => {
                this.setState({
                    reqAddresses: this.state.reqAddresses.concat(element),
                    dropdownContent : this.state.dropdownContent.concat(
                    {
                        id: idx++, 
                        name: (element["properties"]["label"]
                        +" "
                        +element["properties"]["postcode"])
                    }
                    )
                })
                });
                
                console.log(this.state.dropdownContent);
                // console.log(this.state.reqAddresses);
            }
            catch (error) {
                // console.error(error);
            }
            }
        } catch (error) {
            console.error(error);
        }
    }
}