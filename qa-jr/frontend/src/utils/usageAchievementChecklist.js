import { localizedStrings } from "constants/localizedStrings";

function getUsageCheklistItems({ generalChecked, basisList }) {
    const checkedList = generalChecked || {};
    const checklistBasis = basisList || {};
    const checklistItems = localizedStrings.usageAchievements.checklistItems;

    const basisTotal = checklistBasis?.basisTotal || 0;

    const updatedChecklist = Object.keys(checklistItems).map(key => {
        const item = checklistItems[key];
        const basis = checklistBasis[key] || 0;
        const percentage = (basis * 100) / basisTotal
        return({
            ...item,
            checked: checkedList[key],
            percentage: percentage.toFixed(1),
        })
    });

    return(updatedChecklist);
}
export default getUsageCheklistItems;