using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Instool.Authorization.Privileges
{
    public static class PrivilegePacker
    {
        public static string PackPrivilegesToString(this IPrivilegeCollection privileges)
        {
            return string.Join("", privileges.Privileges.Select(p => $"{(char)p.PrivilegeEnum}{PackOperations(p)}"));
        }


        public static PrivilegeCollection UnpackPrivilegesFromString(this string? packedPermissions)
        {
            if (packedPermissions == null)
                throw new ArgumentNullException(nameof(packedPermissions));

            List<Privilege> privileges = new List<Privilege>();
            for (int i = 0; i+1 < packedPermissions.Length; i+=2)
            {
                if (!Enum.IsDefined(typeof(PrivilegeEnum), (short)packedPermissions[i]))
                {
                    continue; // throw ?
                }
                privileges.Add(
                    new Privilege(
                        (PrivilegeEnum)Enum.ToObject(typeof(PrivilegeEnum), (short)packedPermissions[i]),
                        UnpackOperations(packedPermissions[i+1])
                    )
                );
            }
            return new PrivilegeCollection(privileges);
        }


        private static char PackOperations(Privilege p)
        {
            BitArray operations = new BitArray(new bool[]
                {
                    p.IsAuthorized(OperationEnum.Create),
                    p.IsAuthorized(OperationEnum.Read),
                    p.IsAuthorized(OperationEnum.Update),
                    p.IsAuthorized(OperationEnum.Delete),
                    p.IsAuthorized(OperationEnum.Submit)
                });
            int[] temp = new int[1];
            operations.CopyTo(temp, 0);
            return (char)temp[0];
        }

        private static List<OperationEnum> UnpackOperations(char packed)
        {
            BitArray op = new BitArray(new int[] { (int)packed });
            List<OperationEnum> operations = new List<OperationEnum>();
            if (op[0]) { operations.Add(OperationEnum.Create); }
            if (op[1]) { operations.Add(OperationEnum.Read); }
            if (op[2]) { operations.Add(OperationEnum.Update); }
            if (op[3]) { operations.Add(OperationEnum.Delete); }
            if (op[4]) { operations.Add(OperationEnum.Submit); }
            return operations;
        }

    }
}