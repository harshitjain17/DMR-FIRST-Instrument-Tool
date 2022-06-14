using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace Instool.Authorization.Privileges
{
    public class PrivilegeDisplay
    {
        public PrivilegeEnum Privilege { get; private set; }

        public string Name { get; private set; }
        public string Desc { get; private set; }
        public string Group { get; private set; }
        public OperationEnum[] Operations { get; private set; }

        private static readonly Type EnumType = typeof(PrivilegeEnum);

        public static List<PrivilegeDisplay> GetPrivilegesToDisplay()
        {
            var result = new List<PrivilegeDisplay>();
            foreach (var privilegeName in Enum.GetNames(EnumType))
            {
                var member = EnumType.GetMember(privilegeName);
                //This allows you to obsolete a permission and it won't be shown as a possible option, but is still there so you won't reuse the number
                var obsoleteAttribute = member[0].GetCustomAttribute<ObsoleteAttribute>();
                if (obsoleteAttribute != null)
                    continue;
                //If there is no DisplayAttribute then the Enum is not used
                var displayAttribute = member[0].GetCustomAttribute<DisplayAttribute>();
                if (displayAttribute == null)
                    continue;

                var operationsAttribute = member[0].GetCustomAttribute<AvailableOperationsAttribute>();

                var privilege = (PrivilegeEnum)Enum.Parse(EnumType, privilegeName, false);

                result.Add(new PrivilegeDisplay(displayAttribute.GroupName, displayAttribute.Name,
                        displayAttribute.Description, operationsAttribute?.AvailableOperations, privilege));
            }

            return result;
        }

        public static PrivilegeDisplay? GetPrivilegeToDisplay(PrivilegeEnum privilege)
        {
            MemberInfo memberInfo = EnumType.GetMember(privilege.ToString()).FirstOrDefault() ?? throw new Exception($"Unknown privilege {privilege.ToString()}");
            var operationsAttribute = memberInfo.GetCustomAttribute<AvailableOperationsAttribute>();
            var displayAttribute = memberInfo.GetCustomAttribute<DisplayAttribute>();

            if (displayAttribute == null)
            {
                return null;
            }

            return new PrivilegeDisplay(displayAttribute.GroupName, displayAttribute.Name,
                        displayAttribute.Description, 
                        operationsAttribute?.AvailableOperations, 
                        privilege);
        }

        private PrivilegeDisplay(
            string? group, 
            string? name, 
            string? desc, 
            OperationEnum[]? operations, 
            PrivilegeEnum privilege)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name)); ;
            Desc = desc ?? "";
            Group = group ?? throw new ArgumentNullException(nameof(group));
            Operations = operations ?? new OperationEnum[] {OperationEnum.Read };
            Privilege = privilege;
        }
    }
}
