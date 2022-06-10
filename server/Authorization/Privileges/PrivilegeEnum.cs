using System;
using System.ComponentModel.DataAnnotations;

namespace Instool.Authorization.Privileges
{
    public enum PrivilegeEnum : short
    {
        // ************ Customizing *****************
        [Display(GroupName = "Customizing", Name = "InstrumentType", Description = "Instrument Types (aka techniques)")]
        [AvailableOperations("crud")]
        InstrumentType = 10,

        [Display(GroupName = "Customizing", Name = "ApiKey", Description = "Api Keys.")]
        [AvailableOperations("crudl")]
        ApiKey = 11,

        [Display(GroupName = "Customizing", Name = "Role", Description = "Customize Roles and Privileges. Read allows loading details in the customizing dialog.")]
        [AvailableOperations("crud")]
        Role = 12,

        [Display(GroupName = "Customizing", Name = "User", Description = "Customize Users, both external and internal (staff). Read allows loading details of project users, list is required to load all users in the customizing dialog.")]
        [AvailableOperations("crud")]
        User = 13,

        // ************ Data *****************
        [Display(GroupName = "Data", Name = "Instrument", Description = "Instrument")]
        [AvailableOperations("crud")]
        Instrument = 20,

        [Display(GroupName = "Data", Name = "Award", Description = "NSF Award")]
        [AvailableOperations("crud")]
        Award = 21,

        [Display(GroupName = "Data", Name = "Publication", Description = "Publications")]
        [AvailableOperations("crud")]
        Publication = 22,
    }
}
