describe("Parking lot", () => {
    it("contains 9 parkings on initial load", () => {
        cy.visit("/");

        cy.get("[data-testid=parking]").then((parking) => {
            expect(parking.length).to.equal(9);
        });
    });

    it("contains 16 entrances on initial load", () => {
        cy.get("[data-testid=entrance]").then((entrance) => {
            expect(entrance.length).to.equal(16);
        });
    });
});
