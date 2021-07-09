const { assert } = require('chai');

const UsersContract = artifacts.require('UsersContract');
require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('UsersContract', (accounts) => {
    let usersContractInstace;

    before(async () => {
        usersContractInstace = await UsersContract.deployed()
    });

    describe('The UserContract', async () => {
        it('desplegado correctamente', async () => {
            const address = await usersContractInstace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        });
        it('tiene nombre', async () => {
            const nameContract = await usersContractInstace.nameContract()
            assert.equal(
                nameContract,
                'Registro de Usuarios',
                'el nombre es correcto'
            )
        });
    });
    describe('gestión de usuarios', async () => {
        let result, userReg;
        const name = "María";
        const surName = "Pérez";
        before(async () => {
            result = await usersContractInstace.join(
                name,
                surName,
                { from: accounts[0] }
            );
            userReg = await usersContractInstace.getUser(accounts[0]);
        });
        it('devuelve usuario registrado', () => {
            assert.equal(name, userReg[0], "Nombre correcto");
            assert.equal(surName, userReg[1], "Apellido correcto");
        });
        it('no debería permitir registrar una cuenta 2 veces', async () => {
            await usersContractInstace.join(
                "Pablo",
                "Fernández",
                { from: accounts[0] }
            ).should.be.rejected;
        });
    });
});
