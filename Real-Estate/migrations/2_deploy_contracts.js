const Factory = artifacts.require('Factory')
const HomeTransaction = artifacts.require('HomeTransaction')

module.exports = function (deployer, network, accounts) {
  // Deploy Mock DAI Token
  deployer.deploy(Factory)
  // const laAddress = 'la salut 27'
  // const elZip= '08225'
  // const laAddress3 = 'la salut 28'
  // const laAddress2 = 666666
  // const elZip2= 777777
  // const elZip3= '0xe621C57f46abAfc6851039ee7704F984046C0Fe0'
  // const laAddress4 = '0xBaf0Ce1ddecE3Ed6428D24b4AABa5Aa895C95d6A'
  // const elZip4= '0x9020ab4BE1D12411B51a6D1047d5d1C89c8BFACA'
  // deployer.deploy(HomeTransaction, laAddress, elZip, laAddress3,laAddress2, elZip2, elZip3, laAddress4, elZip4)


}
