const util = require('./util');
const expectThrow = util.expectThrow;

let BuildingOwnership = artifacts.require("./../BuildingOwnership.sol");

contract('BuildingOwnership', function (accounts) {

	let buildingContract;

    const firstBuilding = 0;

	const _owner = accounts[0];
    const _notOwner = accounts[1];

    const transferFrom = accounts[0];
    const transferTo = accounts[1];
    const takeOwnershipAccount = accounts[2];

	const buildingName = "Tetrix";
    const buildingAddress = "Sofia, Dragan Tsankov";

    describe("building ownership", () => {

		beforeEach(async function () {
			buildingContract = await BuildingOwnership.new();
		});

		it("should check balance of non-fungible tokens(buildings) by address", async function () {
            let firstListingResult = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let secondListingResult = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let result = await buildingContract.balanceOf(_owner);

            assert.strictEqual(result.toString(10), "2", "There should be 2 non-fungible tokens owned by passed address");            
        });

        it("should check owner of token ID", async function () {
            let listingResult = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let result = await buildingContract.ownerOf(firstBuilding);

            assert.strictEqual(result, _owner, "Owner of nft should be the same as owner of building");        
            assert.notEqual(result, _notOwner, "Owner of nft should be the differ from dummy owner of building");                            
        });

        it("should create transfer of token", async function () {
            let listingResult = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let oldOwner = await buildingContract.ownerOf(firstBuilding);
            assert.strictEqual(oldOwner, transferFrom, "Owner of nft should be transferFrom address before tranfer execution");

            await buildingContract.transfer(transferTo, firstBuilding);
            
            let newOwner = await buildingContract.ownerOf(firstBuilding);
            assert.strictEqual(newOwner, transferTo, "Owner of nft should be transferTo address after tranfer execution");  
            
            let getOwnedByOldOwner = await buildingContract.getBuildingsByOwner(oldOwner);  
            assert.equal(getOwnedByOldOwner.length, 0, 'After transfer array should be empty');       

            let getOwnedByNewOwner = await buildingContract.getBuildingsByOwner(newOwner);
            assert.strictEqual(getOwnedByNewOwner.toString(10), "0", "There should be 1 building owned by new address");            
        });

        it("should throw if non-approved address tries to take ownership of token", async function() {
            await expectThrow(buildingContract.takeOwnership(firstBuilding));
        });

        it("should create approval and after that take ownership of token", async function () {
            let listingResult = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let oldOwner = await buildingContract.ownerOf(firstBuilding);
            assert.strictEqual(oldOwner, transferFrom, "Owner of nft should be transferFrom address before tranfer execution");

            await buildingContract.approve(takeOwnershipAccount, firstBuilding);
            await buildingContract.takeOwnership(firstBuilding, {from: takeOwnershipAccount});
            
            let newOwner = await buildingContract.ownerOf(firstBuilding);
            assert.strictEqual(newOwner, takeOwnershipAccount, "Owner of nft should be takeOwnershipAccount address after approval and take ownership execution");            
        });
        
	});
    
    describe("building listing", () => {

		beforeEach(async function () {
			buildingContract = await BuildingOwnership.new();
		});

		it("should create new building listing", async function () {
            const expectedEvent = 'NewBuilding';

			let result = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );
        
            let buildingsByOwner = await buildingContract.getBuildingsByOwner(_owner);

            assert.strictEqual(buildingsByOwner.toString(10), "0", "There should be 1 listed building with buildingId 0");
            assert.lengthOf(result.logs, 1, "There should be 1 event emitted from creating new building listings!");
            assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
        });

        it("should get all buildings owned by address", async function () {
			let firstListing = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let secondListing = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );

            let thirdListing = await buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _owner}
            );
        
            let buildingsByOwner = await buildingContract.getBuildingsByOwner(_owner);

            assert.strictEqual(buildingsByOwner.toString(10), "0,1,2", "There should be 3 listed buildings with buildingId 0, 1 and 2");
        });
        
        it("should throw if non-owner tries to list building", async function() {
            await expectThrow(buildingContract.listBuilding(
                buildingName,
                buildingAddress, {from: _notOwner}
            ));
        });
    });

})