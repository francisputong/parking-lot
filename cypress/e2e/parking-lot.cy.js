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

    it("can assign new parking size", () => {
        cy.get("[id=tab-tab-3]").click();
        cy.get("[data-testid=parking]")
            .click({ multiple: true })
            .should(($lot) => {
                expect($lot).to.contain("L Parking");
            });
    });

    it("can park a car", () => {
        cy.get("[data-testid=entrance]").first().click();

        cy.get("[data-testid=car-0]").click();
        cy.get("[data-testid=entrance]").first().click();
        cy.get("[data-testid=parking]").first().contains("Car");
    });

    it("can remove a car and compute payment", () => {
        cy.get("[data-testid=parking]").first().click();
    });

    it("can change rows and columns", () => {
        cy.contains("button", "Menu").click();
        cy.get("[name=rows]").select("4");
        cy.get("[name=columns]").select("4");
        cy.get(".btn-close").click();

        cy.get("[data-testid=entrance]").then((entrance) => {
            expect(entrance.length).to.equal(12);
        });

        cy.get("[data-testid=parking]").then((parking) => {
            expect(parking.length).to.equal(4);
        });
    });
});
