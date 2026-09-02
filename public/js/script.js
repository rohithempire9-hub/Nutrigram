// ==========================================
// NUTRIGRAM - MAIN JAVASCRIPT
// ==========================================


// ==========================================
// GET STARTED BUTTON
// ==========================================

const getStartedBtn =
    document.getElementById("getStartedBtn");

if (getStartedBtn) {

    getStartedBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "child.html";

        }
    );

}


// ==========================================
// ADD CHILD FORM
// ==========================================

const childForm =
    document.getElementById("childForm");

if (childForm) {

    childForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -------------------------------
            // GET FORM FIELDS
            // -------------------------------

            const childName =
                document.getElementById("childname");

            const age =
                document.getElementById("age");

            const gender =
                document.getElementById("gender");

            const height =
                document.getElementById("height");

            const weight =
                document.getElementById("weight");

            const eggIntake =
                document.getElementById("eggIntake");

            const milkIntake =
                document.getElementById("milkIntake");

            const vegetableIntake =
                document.getElementById("vegetableIntake");


            // -------------------------------
            // VALIDATION
            // -------------------------------

            if (
                !childName ||
                childName.value.trim() === ""
            ) {

                alert(
                    "Please enter the child's name."
                );

                return;
            }


            if (
                !age ||
                age.value === "" ||
                Number(age.value) <= 0
            ) {

                alert(
                    "Please enter a valid age."
                );

                return;
            }


            if (
                !gender ||
                gender.value === ""
            ) {

                alert(
                    "Please select a gender."
                );

                return;
            }


            if (
                !height ||
                height.value === "" ||
                Number(height.value) <= 0
            ) {

                alert(
                    "Please enter a valid height."
                );

                return;
            }


            if (
                !weight ||
                weight.value === "" ||
                Number(weight.value) <= 0
            ) {

                alert(
                    "Please enter a valid weight."
                );

                return;
            }


            if (
                !eggIntake ||
                eggIntake.value === "" ||
                Number(eggIntake.value) < 0
            ) {

                alert(
                    "Please enter a valid weekly egg intake."
                );

                return;
            }


            if (
                !milkIntake ||
                milkIntake.value === ""
            ) {

                alert(
                    "Please select milk intake."
                );

                return;
            }


            if (
                !vegetableIntake ||
                vegetableIntake.value === ""
            ) {

                alert(
                    "Please select vegetable intake."
                );

                return;
            }


            // -------------------------------
            // CREATE CHILD DATA
            // -------------------------------

            const childData = {

                name:
                    childName.value.trim(),

                age:
                    Number(age.value),

                gender:
                    gender.value,

                height:
                    Number(height.value),

                weight:
                    Number(weight.value),

                eggIntake:
                    Number(eggIntake.value),

                milkIntake:
                    milkIntake.value,

                vegetableIntake:
                    vegetableIntake.value

            };


            // -------------------------------
            // SEND DATA TO SERVER
            // -------------------------------

            try {

                const response =
                    await fetch(
                        "/api/children",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    childData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Could not save child."
                    );

                }


                console.log(
                    "Child saved:",
                    result
                );


                alert("Child information saved successfully!");

// Go to the child records page
window.location.href = "children.html";


                childForm.reset();


            } catch (error) {

                console.error(
                    "Save child error:",
                    error
                );

                alert(error.message);

            }

        }
    );

}


// ==========================================
// CHILDREN RECORDS TABLE
// ==========================================

const childrenTableBody =
    document.getElementById(
        "childrenTableBody"
    );

if (childrenTableBody) {

    loadChildren();

}


// ==========================================
// LOAD ALL CHILDREN
// ==========================================

async function loadChildren() {

    const statusFilter =
        new URLSearchParams(window.location.search).get("status");

    const filterStatus =
        document.getElementById("filterStatus");

    const childrenTableBody =
        document.getElementById("childrenTableBody");


    // ==========================================
    // SHOW ACTIVE FILTER
    // ==========================================

    if (filterStatus && statusFilter) {

        filterStatus.innerHTML = `
            <div class="alert alert-info">
                Showing children with status:
                <strong>${statusFilter}</strong>

                <a
                    href="children.html"
                    class="btn btn-sm btn-secondary ms-2">
                    Show All
                </a>
            </div>
        `;

    } else if (filterStatus) {

        filterStatus.innerHTML = "";

    }


    try {

        // ==========================================
        // LOAD CHILDREN
        // ==========================================

        const response =
            await fetch("/api/children");


        const children =
            await response.json();


        if (!response.ok) {

            throw new Error(
                children.message ||
                "Could not load child records."
            );

        }


        if (
            !Array.isArray(children) ||
            children.length === 0
        ) {

            childrenTableBody.innerHTML = `
                <tr>
                    <td colspan="10"
                        class="text-center">
                        No child records found.
                    </td>
                </tr>
            `;

            return;

        }


        // ==========================================
        // GET STATUS FOR EACH CHILD
        // ==========================================

        const childrenWithStatus = [];


        for (const child of children) {

            let nutritionStatus = "At Risk";


            try {

                const analysisResponse =
                    await fetch(
                        `/api/children/${child._id}/analysis`
                    );


                if (analysisResponse.ok) {

                    const analysis =
                        await analysisResponse.json();


                    const eggs =
                        Number(
                            analysis.foodIntake?.eggsPerWeek ?? 0
                        );


                    const vegetables =
                        analysis.foodIntake?.vegetables || "";


                    const milk =
                        analysis.foodIntake?.milkPerWeek || "";


                    let warningCount = 0;


                    // --------------------------------
                    // EGGS
                    // --------------------------------

                    if (eggs < 3) {

                        warningCount++;

                    }


                    // --------------------------------
                    // VEGETABLES
                    // --------------------------------

                    if (
                        vegetables === "rarely" ||
                        vegetables === "1-2 times a week"
                    ) {

                        warningCount++;

                    }


                    // --------------------------------
                    // MILK
                    // --------------------------------

                    if (
                        milk === "1-2 times" ||
                        milk === "3-4 times"
                    ) {

                        warningCount++;

                    }


                    // --------------------------------
                    // STATUS
                    // --------------------------------

                    if (warningCount === 0) {

                        nutritionStatus = "Good";

                    }
                    else if (warningCount <=2) {

                        nutritionStatus =
                            "Needs Improvement";

                    }
                    else {

                        nutritionStatus = "At Risk";

                    }

                }

            } catch (analysisError) {

                console.error(
                    "Analysis error for:",
                    child.name,
                    analysisError
                );

            }


            childrenWithStatus.push({
                child: child,
                status: nutritionStatus
            });

        }


        // ==========================================
        // APPLY STATUS FILTER
        // ==========================================

        let filteredChildren =
            childrenWithStatus;


        if (statusFilter) {

            filteredChildren =
                childrenWithStatus.filter(
                    function (item) {

                        return (
                            item.status === statusFilter
                        );

                    }
                );

        }


        // ==========================================
        // NO MATCHING CHILDREN
        // ==========================================

        if (
            filteredChildren.length === 0
        ) {

            childrenTableBody.innerHTML = `
                <tr>
                    <td colspan="10"
                        class="text-center py-4">

                        No children found with
                        status
                        <strong>
                            ${statusFilter}
                        </strong>.

                    </td>
                </tr>
            `;

            return;

        }


        // ==========================================
        // CREATE TABLE
        // ==========================================

        childrenTableBody.innerHTML =
            filteredChildren.map(
                function (item) {


                    const child =
                        item.child;


                    const nutritionStatus =
                        item.status;


                    // --------------------------------
                    // STATUS BADGE
                    // --------------------------------

                    let statusClass;


                    if (
                        nutritionStatus === "Good"
                    ) {

                        statusClass =
                            "bg-success";

                    }
                    else if (
                        nutritionStatus ===
                        "Needs Improvement"
                    ) {

                        statusClass =
                            "bg-warning text-dark";

                    }
                    else {

                        statusClass =
                            "bg-danger";

                    }


                    // --------------------------------
                    // TABLE ROW
                    // --------------------------------

                    return `
                        <tr>

                            <td>
                                ${child.name || ""}
                            </td>

                            <td>
                                ${child.age ?? ""}
                            </td>

                            <td>
                                ${child.gender || ""}
                            </td>

                            <td>
                                ${child.height ?? ""} cm
                            </td>

                            <td>
                                ${child.weight ?? ""} kg
                            </td>

                            <td>
                                ${child.eggIntake ?? 0}
                            </td>

                            <td>
                                ${child.milkIntake || ""}
                            </td>

                            <td>
                                ${child.vegetableIntake || ""}
                            </td>

                            <td>

                                <span
                                    class="badge ${statusClass}">
                                    ${nutritionStatus}
                                </span>

                            </td>

                            <td class="text-nowrap">

                                <a
                                    href="editChild.html?id=${child._id}"
                                    class="btn btn-sm btn-warning me-1">
                                    Edit
                                </a>

                                <a
                                    href="nutrition.html?id=${child._id}"
                                    class="btn btn-sm btn-success me-1">
                                    Nutrition
                                </a>

                                <button
                                    type="button"
                                    class="btn btn-sm btn-danger"
                                    onclick="deleteChild('${child._id}')">
                                    Delete
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Load children error:",
            error
        );


        childrenTableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    class="text-center text-danger">

                    Could not load child records.

                </td>
            </tr>
        `;

    }

}

// ==========================================
// DELETE CHILD
// ==========================================

async function deleteChild(id) {

    if (!id) {

        alert(
            "Child ID is missing."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this child record?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/children/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Could not delete the record."
            );

        }


        alert(
            result.message ||
            "Child record deleted successfully."
        );


        loadChildren();
        loadDashboard();

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(error.message);

    }

}


// ==========================================
// EDIT CHILD
// ==========================================

const editChildForm =
    document.getElementById(
        "editChildForm"
    );


const editChildId =
    new URLSearchParams(
        window.location.search
    ).get("id");


if (editChildForm) {

    if (!editChildId) {

        alert(
            "Child ID is missing."
        );

    }
    else {

        loadChildForEdit();


        editChildForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // -------------------------------
                // GET FIELDS
                // -------------------------------

                const nameField =
                    document.getElementById(
                        "childname"
                    );

                const ageField =
                    document.getElementById(
                        "age"
                    );

                const genderField =
                    document.getElementById(
                        "gender"
                    );

                const heightField =
                    document.getElementById(
                        "height"
                    );

                const weightField =
                    document.getElementById(
                        "weight"
                    );

                const eggField =
                    document.getElementById(
                        "eggIntake"
                    );

                const milkField =
                    document.getElementById(
                        "milkIntake"
                    );

                const vegetableField =
                    document.getElementById(
                        "vegetableIntake"
                    );


                // -------------------------------
                // CHECK FIELDS
                // -------------------------------

                if (
                    !nameField ||
                    !ageField ||
                    !genderField ||
                    !heightField ||
                    !weightField ||
                    !eggField ||
                    !milkField ||
                    !vegetableField
                ) {

                    alert(
                        "Edit form fields could not be found. Please check the field IDs."
                    );

                    return;

                }


                // -------------------------------
                // VALIDATION
                // -------------------------------

                if (
                    nameField.value.trim() === ""
                ) {

                    alert(
                        "Please enter the child's name."
                    );

                    return;

                }


                if (
                    ageField.value === "" ||
                    Number(ageField.value) <= 0
                ) {

                    alert(
                        "Please enter a valid age."
                    );

                    return;

                }


                if (
                    genderField.value === ""
                ) {

                    alert(
                        "Please select a gender."
                    );

                    return;

                }


                if (
                    heightField.value === "" ||
                    Number(heightField.value) <= 0
                ) {

                    alert(
                        "Please enter a valid height."
                    );

                    return;

                }


                if (
                    weightField.value === "" ||
                    Number(weightField.value) <= 0
                ) {

                    alert(
                        "Please enter a valid weight."
                    );

                    return;

                }


                if (
                    eggField.value === "" ||
                    Number(eggField.value) < 0
                ) {

                    alert(
                        "Please enter a valid weekly egg intake."
                    );

                    return;

                }


                if (
                    milkField.value === ""
                ) {

                    alert(
                        "Please select milk intake."
                    );

                    return;

                }


                if (
                    vegetableField.value === ""
                ) {

                    alert(
                        "Please select vegetable intake."
                    );

                    return;

                }


                // -------------------------------
                // UPDATED DATA
                // -------------------------------

                const updateData = {

                    name:
                        nameField.value.trim(),

                    age:
                        Number(ageField.value),

                    gender:
                        genderField.value,

                    height:
                        Number(heightField.value),

                    weight:
                        Number(weightField.value),

                    eggIntake:
                        Number(eggField.value),

                    milkIntake:
                        milkField.value,

                    vegetableIntake:
                        vegetableField.value

                };


                console.log(
                    "Sending update:",
                    updateData
                );


                // -------------------------------
                // UPDATE DATABASE
                // -------------------------------

                try {

                    const response =
                        await fetch(
                            `/api/children/${editChildId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        updateData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "Update response:",
                        result
                    );


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Could not update child record."
                        );

                    }


                    alert(
                        "Child information updated successfully!"
                    );


                    window.location.href =
                        "children.html";


                } catch (error) {

                    console.error(
                        "Update child error:",
                        error
                    );

                    alert(error.message);

                }

            }
        );

    }

}


// ==========================================
// LOAD CHILD FOR EDIT
// ==========================================

async function loadChildForEdit() {

    try {

        const response =
            await fetch(
                `/api/children/${editChildId}`
            );


        const child =
            await response.json();


        console.log(
            "Child loaded for editing:",
            child
        );


        if (!response.ok) {

            throw new Error(
                child.message ||
                "Could not load child record."
            );

        }


        const nameField =
            document.getElementById(
                "childname"
            );

        const ageField =
            document.getElementById(
                "age"
            );

        const genderField =
            document.getElementById(
                "gender"
            );

        const heightField =
            document.getElementById(
                "height"
            );

        const weightField =
            document.getElementById(
                "weight"
            );

        const eggField =
            document.getElementById(
                "eggIntake"
            );

        const milkField =
            document.getElementById(
                "milkIntake"
            );

        const vegetableField =
            document.getElementById(
                "vegetableIntake"
            );


        if (nameField) {

            nameField.value =
                child.name ?? "";

        }


        if (ageField) {

            ageField.value =
                child.age ?? "";

        }


        if (genderField) {

            genderField.value =
                child.gender ?? "";

        }


        if (heightField) {

            heightField.value =
                child.height ?? "";

        }


        if (weightField) {

            weightField.value =
                child.weight ?? "";

        }


        if (eggField) {

            eggField.value =
                child.eggIntake ?? "";

        }


        if (milkField) {

            milkField.value =
                child.milkIntake ?? "";

        }


        if (vegetableField) {

            vegetableField.value =
                child.vegetableIntake ?? "";

        }


    } catch (error) {

        console.error(
            "Load child for edit error:",
            error
        );

        alert(error.message);

    }

}
// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response =
            await fetch("/api/children");

        const children =
            await response.json();

        if (!response.ok) {

            throw new Error(
                children.message ||
                "Could not load children."
            );

        }


        // ==================================
        // DASHBOARD COUNTERS
        // ==================================

        let goodcount = 0;
        let improvementcount = 0;
        let atrisk = 0;


        // ==================================
        // CHECK EACH CHILD
        // ==================================

        for (const child of children) {

            try {

                const analysisResponse =
                    await fetch(
                        `/api/children/${child._id}/analysis`
                    );


                if (!analysisResponse.ok) {

                    console.error(
                        "Could not load analysis for:",
                        child.name
                    );

                    continue;

                }


                const analysis =
                    await analysisResponse.json();


                const eggs =
                    Number(
                        analysis.foodIntake.eggsPerWeek
                    );


                const vegetables =
                    analysis.foodIntake.vegetables;


                const milk =
                    analysis.foodIntake.milkPerWeek;


                const bmi =
                    Number(
                        analysis.measurements.bmi
                    );


                let warningCount = 0;


                // ==================================
                // EGGS
                // ==================================

                if (eggs < 3) {

                    warningCount++;

                }


                // ==================================
                // VEGETABLES
                // ==================================

                if (
                    vegetables === "rarely" ||
                    vegetables === "1-2 times a week"
                ) {

                    warningCount++;

                }


                // ==================================
                // MILK
                // ==================================

                if (
                    milk === "1-2 times" ||
                    milk === "3-4 times"
                ) {

                    warningCount++;

                }


                // ==================================
                // BMI
                // ==================================

                if (bmi < 14) {

                    warningCount++;

                }


                // ==================================
                // COUNT STATUS
                // ==================================

                if (warningCount === 0) {

                    goodcount++;

                }
                else if (warningCount <= 2) {

                    improvementcount++;

                }
                else {

                    atrisk++;

                }

            }
            catch (childError) {

                console.error(
                    "Error analyzing child:",
                    child.name,
                    childError
                );

            }

        }


        // ==================================
        // UPDATE DASHBOARD CARDS
        // ==================================

        const totalChildrenElement =
            document.getElementById(
                "totalChildren"
            );


        const goodNutritionElement =
            document.getElementById(
                "goodNutrition"
            );


        const needsImprovementElement =
            document.getElementById(
                "needsImprovement"
            );


        const atRiskElement =
            document.getElementById(
                "atRisk"
            );


        if (totalChildrenElement) {

            totalChildrenElement.textContent =
                children.length;

        }


        if (goodNutritionElement) {

            goodNutritionElement.textContent =
                goodcount;

        }


        if (needsImprovementElement) {

            needsImprovementElement.textContent =
                improvementcount;

        }


        if (atRiskElement) {

            atRiskElement.textContent =
                atrisk;

        }


        // ==================================
        // CHILDREN REQUIRING ATTENTION
        // ==================================

        const attentionContainer =
            document.getElementById(
                "attentionChildren"
            );


        if (attentionContainer) {

            let attentionChildren = [];


            for (const child of children) {

                try {

                    const analysisResponse =
                        await fetch(
                            `/api/children/${child._id}/analysis`
                        );


                    if (!analysisResponse.ok) {

                        continue;

                    }


                    const analysis =
                        await analysisResponse.json();


                    const eggs =
                        Number(
                            analysis.foodIntake.eggsPerWeek
                        );


                    const vegetables =
                        analysis.foodIntake.vegetables;


                    const milk =
                        analysis.foodIntake.milkPerWeek;


                    const bmi =
                        Number(
                            analysis.measurements.bmi
                        );


                    let warningCount = 0;


                    if (eggs < 3) {

                        warningCount++;

                    }


                    if (
                        vegetables === "rarely" ||
                        vegetables ===
                            "1-2 times a week"
                    ) {

                        warningCount++;

                    }


                    if (
                        milk === "1-2 times" ||
                        milk === "3-4 times"
                    ) {

                        warningCount++;

                    }


                    if (bmi < 14) {

                        warningCount++;

                    }


                    if (warningCount > 0) {

                        attentionChildren.push({

                            name: child.name,

                            status:
                                warningCount >= 3
                                    ? "At Risk"
                                    : "Needs Improvement"

                        });

                    }

                }
                catch (error) {

                    console.error(
                        "Attention analysis error:",
                        error
                    );

                }

            }


            // ==================================
            // DISPLAY ATTENTION CHILDREN
            // ==================================

            if (
                attentionChildren.length === 0
            ) {

                attentionContainer.innerHTML = `

                    <div class="alert alert-success">

                        ✅ All children currently
                        have good nutrition status.

                    </div>

                `;

            }
            else {

                attentionContainer.innerHTML =
                    attentionChildren.map(child => `

                        <div class="alert alert-warning mb-2">

                            <strong>
                                👶 ${child.name}
                            </strong>

                            <span class="ms-2">
                                ${child.status}
                            </span>

                        </div>

                    `).join("");

            }

        }


    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}
// ==========================================
// LOAD NUTRITION ANALYSIS
// ==========================================

async function loadNutritionAnalysis() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const childId =
        params.get("id");


    if (!childId) {

        alert(
            "Child ID is missing."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/children/${childId}/analysis`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load nutrition analysis."
            );

        }


        // -------------------------------
        // CHILD INFORMATION
        // -------------------------------

        const childNameElement =
            document.getElementById(
                "childName"
            );

        const childAgeElement =
            document.getElementById(
                "childAge"
            );

        const childGenderElement =
            document.getElementById(
                "childGender"
            );


        if (childNameElement) {

            childNameElement.textContent =
                data.child.name;

        }


        if (childAgeElement) {

            childAgeElement.textContent =
                data.child.age;

        }


        if (childGenderElement) {

            childGenderElement.textContent =
                data.child.gender;

        }


        // -------------------------------
        // BMI
        // -------------------------------

        const bmiElement =
            document.getElementById(
                "bmiValue"
            );
        const bmiCategoryElement =
    document.getElementById("bmiCategory");
        const bmiStatus =
    document.getElementById("bmiStatus");

const bmi =
    data.measurements.bmi;

if (bmiStatus) {

    if (bmi < 14) {

        bmiStatus.innerHTML = `
            <div class="alert alert-warning">
                <strong>⚠️ BMI needs attention</strong>
                <p class="mb-0">
                    The child's BMI is relatively low.
                    Consider providing more nutritious and energy-rich foods.
                </p>
            </div>
        `;

    } else {

        bmiStatus.innerHTML = `
            <div class="alert alert-success">
                <strong>✅ BMI looks good</strong>
                <p class="mb-0">
                    Continue providing a balanced and nutritious diet.
                </p>
            </div>
        `;

    }
}

        if (bmiElement) {

            bmiElement.textContent =
                data.measurements.bmi;

        }
        if (bmiCategoryElement) {

    bmiCategoryElement.textContent =
        "BMI recorded for nutritional screening.";

}
        const heightValue =
    document.getElementById("heightValue");

const weightValue =
    document.getElementById("weightValue");

const growthBmiValue =
    document.getElementById("growthBmiValue");


if (heightValue) {

    heightValue.textContent =
        `${data.measurements.height} cm`;

}


if (weightValue) {

    weightValue.textContent =
        `${data.measurements.weight} kg`;

}


if (growthBmiValue) {

    growthBmiValue.textContent =
        data.measurements.bmi;

}
        // -------------------------------
        // FOOD INTAKE
        // -------------------------------

        const eggElement =
            document.getElementById(
                "eggIntake"
            );

        const milkElement =
            document.getElementById(
                "milkIntake"
            );

        const vegetableElement =
            document.getElementById(
                "vegetableIntake"
            );


        if (eggElement) {

            eggElement.textContent =
                `${data.foodIntake.eggsPerWeek} eggs per week`;

        }


        if (milkElement) {

            milkElement.textContent =
                `${data.foodIntake.milkPerWeek}`;

        }


        if (vegetableElement) {

            vegetableElement.textContent =
                data.foodIntake.vegetables;

        }


        // -------------------------------
        // VARIABLES
        // -------------------------------

        const recommendations =
            document.getElementById(
                "recommendations"
            );


        const eggs =
            data.foodIntake.eggsPerWeek;


        const milk =
            data.foodIntake.milkPerWeek;


        const vegetables =
            data.foodIntake.vegetables;

        const overallStatus =
    document.getElementById("overallStatus");

let warningCount = 0;

if (eggs < 3) {
    warningCount++;
}

if (
    milk === "1-2 times" ||
    milk === "3-4 times"
) {
    warningCount++;
}

if (
    vegetables === "rarely" ||
    vegetables === "1-2 times a week"
) {
    warningCount++;
}

const bmiValue =
    Number(data.measurements.bmi);

if (bmiValue < 14) {
    warningCount++;
}

if (overallStatus) {

    if (warningCount === 0) {

        overallStatus.innerHTML = `
            <div class="alert alert-success">
                <h5>🟢 Good Nutrition Status</h5>
                <p class="mb-0">
                    The recorded food intake and growth measurements
                    do not show major areas requiring attention.
                </p>
            </div>
        `;

    } else if (warningCount <= 2) {

        overallStatus.innerHTML = `
            <div class="alert alert-warning">
                <h5>🟡 Needs Improvement</h5>
                <p class="mb-0">
                    Some nutrition factors need attention.
                    Follow the recommendations below.
                </p>
            </div>
        `;

    } else {

        overallStatus.innerHTML = `
            <div class="alert alert-danger">
                <h5>🔴 Needs Attention</h5>
                <p class="mb-0">
                    Several nutrition factors need attention.
                    Consider improving the child's overall diet
                    and discuss growth concerns with an appropriate
                    health professional when needed.
                </p>
            </div>
        `;

    }
}
        const localfoods =
            document.getElementById(
                "localfoods"
            );


        const anganavadiFoods =
            document.getElementById(
                "anganavadiFoods"
            );


        // ==================================
        // RECOMMENDED LOCAL FOODS
        // ==================================

        let foodSuggestions = [];


        // Protein

        if (eggs < 3) {

            foodSuggestions.push(`
                <div class="alert alert-warning">

                    <h5>
                        🥚 Protein-rich foods
                    </h5>

                    <p class="mb-0">
                        Consider including eggs,
                        dal, chickpeas, green gram
                        and groundnuts more regularly.
                    </p>

                </div>
            `);

        }


        // Calcium

        if (
                milk === "1-2 times" ||
                milk === "3-4 times"
        ) {

            foodSuggestions.push(`
                <div class="alert alert-info">

                    <h5>
                        🥛 Calcium-rich foods
                    </h5>

                    <p class="mb-0">
                        Consider milk, curd,
                        ragi and other
                        calcium-rich foods.
                    </p>

                </div>
            `);

        }


        // Vegetables

        if (
            vegetables === "rarely" ||
            vegetables === "1-2 times a week"
        ) {

            foodSuggestions.push(`
                <div class="alert alert-success">

                    <h5>
                        🥬 Vegetables
                    </h5>

                    <p class="mb-0">
                        Try including locally
                        available vegetables such as
                        leafy greens, carrots,
                        pumpkin and beans.
                    </p>

                </div>
            `);

        }


        // No major gaps

        if (
            foodSuggestions.length === 0
        ) {

            foodSuggestions.push(`
                <div class="alert alert-success">

                    <h5>
                        ✅ Good food variety
                    </h5>

                    <p class="mb-0">
                        Continue providing a variety
                        of nutritious foods and
                        maintain the current
                        food habits.
                    </p>

                </div>
            `);

        }


        // Display

        if (localfoods) {

            localfoods.innerHTML =
                foodSuggestions.join("");

        }


        // ==================================
        // ANGANAVADI SUGGESTIONS
        // ==================================

            // ==================================
// ANGANAVADI SUGGESTIONS
// ==================================

let anganavadiSuggestions = [];


// Anganavadi-provided foods
if (
    data.anganavadiFoods &&
    data.anganavadiFoods.length > 0
) {

    anganavadiSuggestions.push(`
        <div class="alert alert-primary">

            <h5>
                🍲 Anganavadi-provided foods
            </h5>

            <p class="mb-0">
                The child receives meals
                from the Anganavadi center.
            </p>

        </div>
    `);

}


// ==================================
// VEGETABLE SUGGESTION
// ==================================

if (
    vegetables === "rarely" ||
    vegetables === "1-2 times a week"
) {

    anganavadiSuggestions.push(`
        <div class="alert alert-warning">

            <h5>
                🥬 Improve vegetable variety
            </h5>

            <p class="mb-0">
                Consider combining rice with dal
                and locally available green leafy
                vegetables, pumpkin, beans or carrots.
            </p>

        </div>
    `);

}


// ==================================
// EGG SUGGESTION
// ==================================

if (eggs < 3) {

    anganavadiSuggestions.push(`
        <div class="alert alert-warning">

            <h5>
                🥚 Improve protein intake
            </h5>

            <p class="mb-0">
                Consider including eggs, dal,
                chickpeas, green gram or groundnuts
                more regularly.
            </p>

        </div>
    `);

}


// ==================================
// MILK SUGGESTION
// ==================================

if (
    milk === "1-2 times" ||
    milk === "3-4 times"
) {

    anganavadiSuggestions.push(`
        <div class="alert alert-warning">

            <h5>
                🥛 Improve calcium intake
            </h5>

            <p class="mb-0">
                Consider including more calcium-rich
                foods such as milk, curd or ragi.
            </p>

        </div>
    `);

}


// ==================================
// NO PROBLEMS
// ==================================

if (
    anganavadiSuggestions.length === 0
) {

    anganavadiSuggestions.push(`
        <div class="alert alert-success">

            <h5>
                ✅ Good Anganavadi nutrition
            </h5>

            <p class="mb-0">
                The child's recorded food intake
                does not show major areas requiring
                attention.
            </p>

        </div>
    `);

}


// ==================================
// DISPLAY ANGANAVADI SUGGESTIONS
// ==================================

if (anganavadiFoods) {

    anganavadiFoods.innerHTML =
        anganavadiSuggestions.join("");

}


// ==================================
// RECOMMENDATIONS
// ==================================

let messages = [];


// Eggs
if (eggs < 3) {

    messages.push(`
        <div class="alert alert-warning">

            🥚 <strong>Egg Intake:</strong>

            Egg intake is low.
            Consider including eggs or other
            protein-rich foods more regularly.

        </div>
    `);

} else {

    messages.push(`
        <div class="alert alert-success">

            🥚 <strong>Egg Intake:</strong>

            Good egg intake.
            Continue providing protein-rich foods.

        </div>
    `);

}


// Milk
if (
    milk === "1-2 times" ||
    milk === "3-4 times"
) {

    messages.push(`
        <div class="alert alert-warning">

            🥛 <strong>Milk Intake:</strong>

            Milk intake could be increased.
            Consider milk, curd or ragi more regularly.

        </div>
    `);

} else {

    messages.push(`
        <div class="alert alert-success">

            🥛 <strong>Milk Intake:</strong>

            Good milk intake.
            Continue providing calcium-rich foods.

        </div>
    `);

}


// Vegetables
if (vegetables === "rarely") {

    messages.push(`
        <div class="alert alert-danger">

            🥬 <strong>Vegetable Intake:</strong>

            Vegetable intake is very low.
            Try including locally available
            vegetables more frequently.

        </div>
    `);

} else if (
    vegetables === "1-2 times a week"
) {

    messages.push(`
        <div class="alert alert-warning">

            🥬 <strong>Vegetable Intake:</strong>

            Vegetable intake is low.
            Encourage vegetables more frequently
            and include different varieties.

        </div>
    `);

} else {

    messages.push(`
        <div class="alert alert-success">

            🥬 <strong>Vegetable Intake:</strong>

            Vegetable intake is good.
            Continue including a variety of vegetables.

        </div>
    `);

}


// Display recommendations
if (recommendations) {

    recommendations.innerHTML =
        messages.join("");

}
    } catch (error) {

        console.error(
            "Nutrition analysis error:",
            error
        );

        alert(error.message);

    }

}
// ==========================================
// START DASHBOARD
// ==========================================

// ==========================================
// START DASHBOARD
// ==========================================

if (document.getElementById("totalChildren")) {

    loadDashboard();

}


// ==========================================
// START NUTRITION ANALYSIS
// ==========================================

if (document.getElementById("childName")) {

    loadNutritionAnalysis();

}


// ==========================================
// DASHBOARD CARD CLICK ACTIONS
// ==========================================

const goodCard =
    document.getElementById("goodNutritionCard");

const improvementCard =
    document.getElementById("needsImprovementCard");

const riskCard =
    document.getElementById("atRiskCard");


if (goodCard) {

    goodCard.style.cursor = "pointer";

    goodCard.onclick = function () {

        window.location.href =
            "children.html?status=Good";

    };

}


if (improvementCard) {

    improvementCard.style.cursor = "pointer";

    improvementCard.onclick = function () {

        window.location.href =
            "children.html?status=Needs%20Improvement";

    };

}


if (riskCard) {

    riskCard.style.cursor = "pointer";

    riskCard.onclick = function () {

        window.location.href =
            "children.html?status=At%20Risk";

    };

}
// ==========================================
// START CHILD RECORDS
// ==========================================

if (
    document.getElementById("childrenTableBody")
) {

    loadChildren();

}
// ==========================================
// CHILD RECORD SEARCH & QUICK FILTER
// ==========================================

const childSearch =
    document.getElementById("childSearch");

const recordFilterButtons =
    document.querySelectorAll(
        ".records-filter-buttons .btn"
    );


// Search children by name
if (childSearch) {

    childSearch.addEventListener(
        "input",
        function () {

            const searchText =
                childSearch.value
                    .toLowerCase()
                    .trim();

            const rows =
                document.querySelectorAll(
                    "#childrenTableBody tr"
                );

            rows.forEach(function (row) {

                const nameCell =
                    row.querySelector("td");

                if (!nameCell) {
                    return;
                }

                const name =
                    nameCell.textContent
                        .toLowerCase();

                if (name.includes(searchText)) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            });

        }
    );

}


// Quick status filters
recordFilterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                recordFilterButtons.forEach(
                    function (btn) {
                        btn.classList.remove("active");
                    }
                );

                button.classList.add("active");

                const selectedFilter =
                    button.dataset.filter;

                const rows =
                    document.querySelectorAll(
                        "#childrenTableBody tr"
                    );

                rows.forEach(function (row) {

                    if (selectedFilter === "all") {

                        row.style.display = "";

                        return;
                    }

                    const statusBadge =
                        row.querySelector(
                            ".badge"
                        );

                    if (!statusBadge) {
                        return;
                    }

                    const status =
                        statusBadge.textContent.trim();

                    if (
                        status === selectedFilter
                    ) {

                        row.style.display = "";

                    } else {

                        row.style.display = "none";

                    }

                });

            }
        );

    }
);