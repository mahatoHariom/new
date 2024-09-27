/* eslint-disable consistent-return */
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable react-hooks/exhaustive-deps */
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
// import { AxiosError } from 'axios';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { FormProvider, useForm } from 'react-hook-form';
// import { useMutation, useQuery } from 'react-query';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { MESSAGES } from '~/constants/messages';
// import { MODAL_KEYS } from '~/constants/modal_key';
// import { MutationKey, QueryKey } from '~/constants/query';
// import { removeUserFromGroup } from '~/helpers/remove-user-from-group';
// // import { removeUserFromGroup } from '~/helpers/remove-user-from-group';
// import { updateUserAttributes } from '~/helpers/update-user-atrribute-cognito';
// import useDraggableScroll from '~/hooks/use-draggable-scroll';
// import { closeModal, openModal } from '~/modules/modal/action';
// import { countryAdminGetAllUniversityUsersOfUniversity } from '~/services/api/countryAdmin';
// import { AddRoleHandler, RemoveRoleHandler } from '~/services/api/user';
// import { poolDataConfig } from '~/services/cognito/userPoolConfig';
// import { useAppDispatch, useAppSelector } from '~/store/hooks';
// import { userAcessType } from '~/types/global';
// import { UniversityUser } from '~/types/universityUser';
// import { UserModal } from '~/types/user';
// import { FindAuthErrorMessage } from '~/utils/findErrorMessage';
// import { formatEnumToString } from '~/utils/formatEnumtoString';
// import { getProperDate } from '~/utils/getDateinFormFormat';
// import { handleAxiosError } from '~/utils/handleAxiosError';
// import Pagination from '~/view/component/Common/custom-pagination';
// import DropdownSelect, { DropdownType } from '~/view/component/Common/Dropdown';
// import BaseDropdown from '~/view/component/Common/Dropdown/BaseDropdown';
// import GlobalModal from '~/view/component/Common/global-modal';
// import ChevronDown from '~/view/component/Common/Icon/chevron-down';
// import ChevronUp from '~/view/component/Common/Icon/chevron-up';
// import SearchInput from '~/view/component/Common/searchinput';
// import Heading from '~/view/component/Common/text/heading';
// import SubHeading from '~/view/component/Common/text/subheading';
// import UserAvatar from '~/view/component/Common/user/user-avatar';
// import NoDataAvailable from '~/view/component/researcher/datanotfound/nowebinar-data-researcher';
// import TableLoadingSkeleton from '~/view/component/skeleton/TableSkeleton';
// import SwitchRoleConfirmationModal from '~/view/pages/university/components/switch-role-modal-confirmation';

// const CountryAdminAllTTOAdminsPage = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const { id: userId } = useAppSelector(state => state.user);
//   const allUniversities = useAppSelector(state => state.universities);
//   const [roles, setRoles] = useState<string[]>([]);
//   const [pageSize, _setPageSize] = useState(20);
//   const [page, setPage] = useState(Number(queryParams.get('page')) || 1);
//   const [search, setSearch] = useState(queryParams.get('search') || '');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [field, _setField] = useState(queryParams.get('field') || '');
//   const [order, _setOrder] = useState(queryParams.get('order') || '');
//   const [sorting, setSorting] = useState({ field, order });
//   const [selectedUser, setSelectedUser] = useState<UserModal | null>(null);
//   const [changedRole, setChangedRole] = useState<string>('');
//   const [roleChanging, setRoleChanging] = useState<boolean>(false);
//   // const [addingRole, _setAddingRole] = useState<boolean>(false);

//   const [roleToRemove, setRoleToRemove] = useState<string>('');

//   const navigate = useNavigate();
//   useEffect(() => {
//     const filteredValues = roles.filter(Boolean);
//     navigate(
//       `?page=${page}&search=${search}&pageSize=${pageSize}&field=${sorting.field}&order=${sorting.order}&roles=${filteredValues}`,
//       {
//         replace: true,
//       },
//     );
//   }, [navigate, page, setSearch, pageSize, sorting, search, roles]);
//   const { ref, isDragging, handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
//     useDraggableScroll();
//   const methods = useForm({
//     defaultValues: { selectedOption: allUniversities[0]?.id },
//   });

//   const selectedOption = methods.watch('selectedOption');
//   const skeletonColumns = ['FIRST NAME', 'EMAIL ADDRESS', 'ROLE', 'STATUS', 'JOINED', 'ACTIONS'];
//   const userRoleType = [
//     userAcessType.RESEARCHER,
//     userAcessType.UNIVERSITY_ADMIN,
//     userAcessType.UNIVERSITY_ADMIN_STAFF,
//   ];

//   const { data, isLoading, refetch } = useQuery(
//     [
//       QueryKey.COUNTRY_ADMIN_GET_ALL_UNIVERSITY_USERS,
//       selectedOption,
//       search,
//       page,
//       pageSize,
//       sorting,
//       roles,
//     ],
//     () =>
//       countryAdminGetAllUniversityUsersOfUniversity({
//         userId,
//         universityId: selectedOption,
//         page,
//         pageSize,
//         search,
//         field: sorting.field,
//         order: sorting.order,
//         roles,
//       }),
//     {
//       enabled: !!selectedOption,
//       onError: handleAxiosError,
//     },
//   );
//   const handleSort = (columnId: string) => {
//     setSorting(prevSorting => {
//       let newOrder = 'asc';
//       if (prevSorting.field === columnId && prevSorting.order === 'asc') {
//         newOrder = 'desc';
//       }
//       return { field: columnId, order: newOrder };
//     });
//   };

//   const universityOptions = useMemo(
//     () =>
//       allUniversities.map(university => ({
//         label: university.name || '',
//         value: university.id,
//       })),
//     [allUniversities],
//   );
//   const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
//   const tableData: UniversityUser[] = data?.data?.data || [];
//   const columnHelper = createColumnHelper<UniversityUser>();
//   const { mutate: addRoleMutation, isLoading: addingRole } = useMutation({
//     mutationKey: MutationKey.ADD_ROLE,
//     mutationFn: AddRoleHandler,
//   });

//   const { mutate: removeRoleMutation, isLoading: removingRoleLoading } = useMutation({
//     mutationKey: MutationKey.REMOVE_ROLE,
//     mutationFn: RemoveRoleHandler,
//   });

//   const dispatch = useAppDispatch();
//   const assignRoleHandler = async () => {
//     try {
//       setRoleChanging(true);

//       if (changedRole === userAcessType.RESEARCHER) {
//         await handleResearcherRole();
//         return;
//       }
//       const toBeRemovedRole = selectedUser?.roles?.find(
//         role =>
//           (role === userAcessType.UNIVERSITY_ADMIN &&
//             changedRole === userAcessType.UNIVERSITY_ADMIN_STAFF) ||
//           (role === userAcessType.UNIVERSITY_ADMIN_STAFF &&
//             changedRole === userAcessType.UNIVERSITY_ADMIN),
//       );
//       if (toBeRemovedRole && toBeRemovedRole !== userAcessType.UNIVERSITY_ADMIN_STAFF) {
//         debugger;
//         await removeUserFromGroup(selectedUser?.email as string, toBeRemovedRole);
//         debugger;
//         await updateUserAttributes(selectedUser?.email as string, changedRole);
//         await addUserToGroup(changedRole);
//         return;
//       }

//       if (toBeRemovedRole === userAcessType.UNIVERSITY_ADMIN_STAFF) {
//         const isUniversityAdminAvailable = await countryAdminGetAllUniversityUsersOfUniversity({
//           userId,
//           universityId: selectedOption,
//           roles: userAcessType.UNIVERSITY_ADMIN,
//         });

//         if (isUniversityAdminAvailable?.data?.data?.length > 0) {
//           // debugger;
//           await removeUserFromGroup(
//             data?.data?.data[0]?.user?.email as string,
//             userAcessType.UNIVERSITY_ADMIN,
//           );

//           await updateUserAttributes(
//             data?.data?.data[0]?.user?.email as string,
//             userAcessType.UNIVERSITY_ADMIN_STAFF,
//           );

//           const params = {
//             UserPoolId: poolDataConfig.UserPoolId,
//             Username: data?.data?.data[0]?.user?.email as string,
//             GroupName: userAcessType.UNIVERSITY_ADMIN_STAFF,
//           };

//           return await new Promise<void>((resolve, reject) => {
//             cognitoIdentityServiceProvider.adminAddUserToGroup(params, async (err, result) => {
//               if (err) {
//                 toast.error(`Error adding user to group: ${err.message}`);
//                 setRoleChanging(false);
//                 reject(err);
//               } else {
//                 cognitoIdentityServiceProvider.adminUserGlobalSignOut(
//                   {
//                     UserPoolId: poolDataConfig.UserPoolId,
//                     Username: data?.data?.data[0]?.user?.email as string,
//                   },
//                   async (signOutErr, signOutResult) => {
//                     if (signOutErr) {
//                       toast.error(`Error adding user to group: ${signOutErr.message}`);
//                       setRoleChanging(false);
//                       reject(signOutErr);
//                     }
//                     if (result) {
//                       await updateUserAttributes(selectedUser?.email as string, changedRole);
//                       await addUserToGroup(changedRole);
//                       resolve();
//                     }
//                   },
//                 );
//               }
//             });
//           });
//         }
//       }
//       await updateUserAttributes(selectedUser?.email as string, changedRole);
//       await addUserToGroup(changedRole);

//       // if (
//       //   changedRole === userAcessType.UNIVERSITY_ADMIN ||
//       //   changedRole === userAcessType.UNIVERSITY_ADMIN_STAFF
//       // ) {
//       //   if (toBeRemovedRole) {
//       //     await removeUserFromGroup(selectedUser?.email as string, toBeRemovedRole);
//       //   }

//       //   await updateUserAttributes(selectedUser?.email as string, changedRole);
//       //   await addUserToGroup(changedRole);
//       // }
//     } catch (error) {
//       setRoleChanging(false);
//       handleError(error);
//     }
//   };

//   const handleError = (error: unknown) => {
//     if (error instanceof AxiosError) {
//       const errorMessage = FindAuthErrorMessage(error);
//       if (errorMessage) {
//         toast.error(errorMessage.EN);
//       }
//     }
//   };

//   const handleResearcherRole = async () => {
//     try {
//       await updateUserAttributes(selectedUser?.email as string, userAcessType.RESEARCHER);
//       await addUserToGroup(userAcessType.RESEARCHER);
//     } catch (error) {
//       handleError(error);
//     }
//   };
//   // const removeUserFromGroup = async (userId: string, groupName: string) => {
//   //   const params = {
//   //     UserPoolId: poolDataConfig.UserPoolId,
//   //     Username: userId,
//   //     GroupName: groupName,
//   //   };

//   //   return new Promise((resolve, reject) => {
//   //     cognitoIdentityServiceProvider.adminRemoveUserFromGroup(params, (err, result) => {
//   //       if (err) {
//   //         toast.error(`Error removing role: ${groupName}, ${err.message}`);
//   //         reject(err);
//   //       } else {
//   //         console.log(`Removed role: ${groupName}`);
//   //         resolve(result);
//   //       }
//   //     });
//   //   });
//   // };

//   const addUserToGroup = async (groupName: string) => {
//     const params = {
//       UserPoolId: poolDataConfig.UserPoolId,
//       Username: selectedUser?.email as string,
//       GroupName: groupName,
//     };

//     return new Promise<void>((resolve, reject) => {
//       cognitoIdentityServiceProvider.adminAddUserToGroup(params, async (err, result) => {
//         if (err) {
//           toast.error(`Error adding user to group: ${err.message}`);
//           setRoleChanging(false);
//           reject(err);
//         } else {
//           cognitoIdentityServiceProvider.adminUserGlobalSignOut(
//             { UserPoolId: poolDataConfig.UserPoolId, Username: selectedUser?.email as string },
//             async (signOutErr, signOutResult) => {
//               if (signOutErr) {
//                 toast.error(`Error adding user to group: ${signOutErr.message}`);
//                 setRoleChanging(false);
//                 reject(signOutErr);
//               }
//               if (result) {
//                 addRoleMutation(
//                   {
//                     userId: selectedUser?.id as string,
//                     userType: groupName,
//                   },
//                   {
//                     onSuccess: () => {
//                       toast.success(
//                         `Role ${formatEnumToString(groupName)} has been added successfully`,
//                       );
//                       refetch();
//                       setRoleChanging(false);
//                       dispatch(
//                         closeModal({
//                           name: MODAL_KEYS.ADD_ROLE_MODAL,
//                         }),
//                       );
//                       resolve();
//                     },
//                     onError: error => {
//                       reject(error);
//                       setRoleChanging(false);
//                       handleAxiosError(error);
//                     },
//                   },
//                 );
//               }
//             },
//           );
//           // try {
//           //   await addRoleMutation(
//           //     {
//           //       userId: selectedUser?.id as string,
//           //       userType: groupName,
//           //     },
//           //     {
//           //       onSuccess: () => {
//           //         toast.success(
//           //           `Role ${formatEnumToString(groupName)} has been added successfully`,
//           //         );
//           //         refetch();
//           //         setRoleChanging(false);
//           //         dispatch(
//           //           closeModal({
//           //             name: MODAL_KEYS.ADD_ROLE_MODAL,
//           //           }),
//           //         );
//           //       },
//           //       onError: error => {
//           //         setRoleChanging(false);
//           //         handleAxiosError(error);
//           //       },
//           //     },
//           //   );

//           //   resolve();
//           // } catch (error) {
//           //   setRoleChanging(false);
//           //   reject(error);
//           // }
//         }
//       });
//     });
//   };

//   const handleRoleChange = useCallback(async (newRole: string[], user: UserModal) => {
//     setSelectedUser(user);
//     const removedRole = user?.roles?.filter(role => !newRole?.includes(role));

//     if (removedRole && removedRole?.length > 0) {
//       debugger;
//       if (newRole?.length === 0) {
//         toast.error(MESSAGES.USER_MUST_HAVE_ONE_ROLE.EN);
//         return;
//       }
//       setRoleToRemove(removedRole?.[0]);
//       dispatch(
//         openModal({
//           name: MODAL_KEYS.COUNTRY_ADMIN_REMOVE_ROLE_MODAL,
//         }),
//       );
//       return;
//     }

//     debugger;

//     const oldRole = user?.roles;
//     const newRoleArray = Array.isArray(newRole) ? newRole : [newRole];
//     const addedRoles: string[] = newRoleArray?.filter(role => !oldRole?.includes(role));
//     setChangedRole(addedRoles[0]);
//     dispatch(
//       openModal({
//         name: MODAL_KEYS.ADD_ROLE_MODAL,
//       }),
//     );
//   }, []);

//   const handleRemoveRoleFromCognitoAndBackend = async () => {
//     try {
//       setRoleChanging(true);
//       debugger;
//       // const addRole = selectedUser?.roles?.filter(role => role !== roleToRemove);

//       await removeUserFromGroup(selectedUser?.email as string, roleToRemove);
//       // await updateUserAttributes(selectedUser?.email as string, addRole?.[0] as string);
//       // const params = {
//       //   UserPoolId: poolDataConfig.UserPoolId,
//       //   Username: selectedUser?.email as string,
//       //   GroupName: addRole?.[0] as string,
//       // };

//       return await new Promise<void>((resolve, reject) => {
//         // cognitoIdentityServiceProvider.adminAddUserToGroup(params, async (err, result) => {
//         //   if (err) {
//         //     toast.error(`Error adding user to group: ${err.message}`);
//         //     setRoleChanging(false);
//         //     reject(err);
//         //   } else {
//         cognitoIdentityServiceProvider.adminUserGlobalSignOut(
//           {
//             UserPoolId: poolDataConfig.UserPoolId,
//             Username: selectedUser?.email as string,
//           },

//           async (signOutErr, signOutResult) => {
//             if (signOutErr) {
//               toast.error(`Error adding user to group: ${signOutErr.message}`);
//               setRoleChanging(false);
//               reject(signOutErr);
//             }
//             if (signOutResult) {
//               await removeRoleMutation(
//                 {
//                   userId: selectedUser?.id as string,
//                   userType: roleToRemove,
//                 },
//                 {
//                   onSuccess: () => {
//                     toast.success(MESSAGES.REMOVED_ROLE_SUCCESS.EN);
//                     refetch();

//                     debugger;

//                     setRoleChanging(false);
//                     dispatch(
//                       closeModal({
//                         name: MODAL_KEYS.COUNTRY_ADMIN_REMOVE_ROLE_MODAL,
//                       }),
//                     );
//                     resolve();
//                   },
//                   onError: error => {
//                     reject(error);
//                     setRoleChanging(false);
//                     handleAxiosError(error);
//                   },
//                 },
//               );
//             }
//           },
//         );
//         // }
//         // });
//       });
//       // return await new Promise<void>((resolve, reject) => {
//       //   cognitoIdentityServiceProvider.adminUserGlobalSignOut(
//       //     { UserPoolId: poolDataConfig.UserPoolId, Username: selectedUser?.email as string },
//       //     async (signOutErr, signOutResult) => {
//       //       if (signOutErr) {
//       //         toast.error(`Error adding user to group: ${signOutErr.message}`);
//       //         setRoleChanging(false);
//       //         reject(signOutErr);
//       //       } else {
//       //         await removeRoleMutation(
//       //           {
//       //             userId: selectedUser?.id as string,
//       //             userType: roleToRemove,
//       //           },
//       //           {
//       //             onSuccess: () => {
//       //               toast.success(MESSAGES.REMOVED_ROLE_SUCCESS.EN);
//       //               refetch();

//       //               setRoleChanging(false);
//       //               dispatch(
//       //                 closeModal({
//       //                   name: MODAL_KEYS.COUNTRY_ADMIN_REMOVE_ROLE_MODAL,
//       //                 }),
//       //               );
//       //               resolve();
//       //             },
//       //             onError: error => {
//       //               reject(error);
//       //               setRoleChanging(false);
//       //               handleAxiosError(error);
//       //             },
//       //           },
//       //         );
//       //       }
//       //     },
//       //   );
//       // });
//     } catch (error) {
//       setRoleChanging(false);
//       handleError(error);
//     }
//   };

//   const columns = useMemo(
//     () => [
//       columnHelper.accessor('user.firstName', {
//         id: 'firstName',
//         header: 'FIRST NAME',
//         cell: props => (
//           <div className="flex items-center space-x-3 lg:w-80 w-30 gap-2">
//             <UserAvatar
//               firstName={props?.row?.original?.user?.firstName ?? ''}
//               imageUrl={props?.row?.original?.user?.imageUrl ?? ''}
//               lastName={props?.row?.original?.user?.lastName ?? ''}
//             />
//             <span className="flex gap-1 items-center w-full">
//               <span>{props?.row?.original?.user?.firstName}</span>
//               <span>{props?.row?.original?.user?.lastName}</span>
//             </span>
//           </div>
//         ),
//       }),
//       columnHelper.accessor('user.email', {
//         id: 'email',
//         header: 'EMAIL ADDRESS',
//         cell: props => (
//           <div className="text-sm font-medium">{props?.row?.original?.user.email}</div>
//         ),
//       }),
//       columnHelper.accessor('user.roles', {
//         id: 'role',
//         header: 'ROLE',
//         cell: props => (
//           <div className="text-sm font-medium   max-w-60">
//             <BaseDropdown
//               handleChange={value => {
//                 handleRoleChange(value as string[], props.row.original.user);
//               }}
//               label="Select"
//               name="select"
//               options={userRoleType}
//               placeholder="NONE"
//               size="lg"
//               value={props?.row?.original?.user?.roles as string[]}
//             />
//           </div>
//         ),
//       }),
//       columnHelper.accessor('user.deletedAt', {
//         id: 'deletedAt',
//         header: 'STATUS',
//         cell: props => (
//           <div className="text-sm font-medium">
//             {props?.row?.original?.user.deletedAt === null ? 'Active' : 'Inactive'}
//           </div>
//         ),
//       }),
//       columnHelper.accessor('user.createdAt', {
//         id: 'createdAt',
//         header: 'JOINED',
//         cell: props => (
//           <div className="text-sm font-medium">
//             {getProperDate(props?.row?.original?.user.createdAt as string)}
//           </div>
//         ),
//       }),
//       // columnHelper.accessor('user', {
//       //   id: 'actions',
//       //   header: 'ACTIONS',
//       //   cell: () => <div className="">Actions Placeholder</div>,
//       // }),
//     ],
//     [columnHelper],
//   );

//   const table = useReactTable({
//     data: tableData,
//     columns,
//     manualSorting: true,
//     state: { sorting: [{ id: sorting.field, desc: sorting.order === 'desc' }] },
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleFilterChange = useCallback((newFilterValue: string[] | string) => {
//     setRoles(newFilterValue as string[]);
//   }, []);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearch = () => {
//     setSearch(searchTerm);
//     setPage(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   return (
//     <>
//       <FormProvider {...methods}>
//         <div className="w-full h-full flex flex-col gap-4">
//           <div className="flex flex-col gap-1">
//             <Heading>User Management</Heading>
//             <SubHeading>Find information about all your users here</SubHeading>
//           </div>

//           <div className="flex flex-col xl:flex-row w-full items-center justify-between gap-3">
//             <div className="flex justify-evenly xl:w-1/2 w-full items-center gap-6">
//               <div className="w-1/2">
//                 <DropdownSelect
//                   className="h-11 border border-sky-400   focus:shadow-none focus:outline-none"
//                   label=""
//                   name="selectedOption"
//                   options={universityOptions}
//                   placeholder="Select a University"
//                   size="md"
//                   type={DropdownType.NORMAL}
//                 />
//               </div>

//               <div className="w-1/2">
//                 <BaseDropdown
//                   handleChange={handleFilterChange}
//                   label="Select"
//                   name="select"
//                   options={userRoleType}
//                   placeholder="Filter by role"
//                   size="lg"
//                   value={roles}
//                 />
//               </div>
//             </div>

//             <div className="xl:w-2/6 w-full">
//               <SearchInput
//                 placeholder="Search for a user"
//                 onChange={handleSearchChange}
//                 onSearch={handleSearch}
//               />
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="w-full mt-10">
//               <TableLoadingSkeleton columns={skeletonColumns} rows={10} />
//             </div>
//           ) : data?.data?.data?.length && data?.data?.data?.length > 0 ? (
//             <>
//               <div className="flex flex-col gap-0 ">
//                 {data?.data?.data?.length && data?.data?.data?.length > 0 && (
//                   <div
//                     className="w-full h-full flex flex-col border border-slate-200 rounded-t overflow-x-auto"
//                     ref={ref}
//                     style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//                     onMouseDown={handleMouseDown}
//                     onMouseLeave={handleMouseLeave}
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                   >
//                     <table className="w-full text-left">
//                       <thead className="bg-slate-50">
//                         {table.getHeaderGroups().map(headerGroup => (
//                           <tr key={headerGroup?.id}>
//                             {headerGroup.headers.map(header => (
//                               <th
//                                 className="px-6 py-3 text-slate-500 text-xs font-medium uppercase tracking-wide cursor-pointer"
//                                 key={header?.id}
//                                 onClick={() => handleSort(header?.column?.id)}
//                               >
//                                 <div className="flex justify-between items-center">
//                                   {flexRender(header.column.columnDef.header, header.getContext())}
//                                   {header.column.columnDef.header === 'ACTIONS' ? null : (
//                                     <div className="flex flex-col items-center">
//                                       <ChevronUp isBold={header.column.getIsSorted() === 'asc'} />
//                                       <ChevronDown
//                                         isBold={header.column.getIsSorted() === 'desc'}
//                                       />
//                                     </div>
//                                   )}
//                                 </div>
//                               </th>
//                             ))}
//                           </tr>
//                         ))}
//                       </thead>
//                       <tbody className="w-full divide-y divide-slate-200">
//                         {table.getRowModel().rows.map(row => (
//                           <tr
//                             className="text-slate-500 text-sm bg-white hover:bg-slate-50"
//                             key={row.id}
//                           >
//                             {row.getVisibleCells().map(cell => (
//                               <td className="px-6 py-4" key={cell.id}>
//                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 <div className="w-full pb-5 z-0">
//                   {data?.data?.meta && (
//                     <div className="border-slate-200 border-t-0 p-3 border rounded-b z-0">
//                       <Pagination
//                         currentPage={data?.data?.meta?.currentPage}
//                         next={data?.data?.meta.next as number}
//                         perPage={data?.data?.meta?.perPage}
//                         prev={data?.data?.meta?.prev as number}
//                         total={data?.data?.meta?.total}
//                         totalPages={data?.data?.meta?.lastPage}
//                         onPageChange={handlePageChange}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <NoDataAvailable
//               hideButton
//               description={MESSAGES.NO_USER_AVAILABLE_MESSAGE.EN}
//               message={MESSAGES.NO_USER_AVAILABLE_DESCRIPTION.EN}
//             />
//           )}
//         </div>
//       </FormProvider>

//       <GlobalModal
//         name={MODAL_KEYS.ADD_ROLE_MODAL}
//         size="small"
//         title={`Assign ${formatEnumToString(changedRole)} Role`}
//       >
//         <SwitchRoleConfirmationModal
//           description={` Are you sure you want to assign the ${formatEnumToString(changedRole)} role to this account`}
//           handleConfirm={assignRoleHandler}
//           loading={addingRole || roleChanging}
//           modalname={MODAL_KEYS.ADD_ROLE_MODAL}
//           title="Assign Researcher Role"
//         />
//       </GlobalModal>

//       <GlobalModal
//         name={MODAL_KEYS.COUNTRY_ADMIN_REMOVE_ROLE_MODAL}
//         size="small"
//         title={`Remove ${formatEnumToString(roleToRemove)} Role`}
//       >
//         <SwitchRoleConfirmationModal
//           description={` Are you sure you want to remove the ${formatEnumToString(roleToRemove)} role from  this account`}
//           handleConfirm={handleRemoveRoleFromCognitoAndBackend}
//           loading={removingRoleLoading || roleChanging}
//           modalname={MODAL_KEYS.COUNTRY_ADMIN_REMOVE_ROLE_MODAL}
//           title={`Remove ${formatEnumToString(roleToRemove)} Role`}
//         />
//       </GlobalModal>
//     </>
//   );
// };

// export default CountryAdminAllTTOAdminsPage;
// // const assignRoleHandler = async () => {
// //   try {
// //     const roleToRemove = selectedUser?.roles?.find(
// //       role =>
// //         (role === userAcessType.UNIVERSITY_ADMIN &&
// //           changedRole === userAcessType.UNIVERSITY_ADMIN_STAFF) ||
// //         (role === userAcessType.UNIVERSITY_ADMIN_STAFF &&
// //           changedRole === userAcessType.UNIVERSITY_ADMIN),
// //     );

// //     if (roleToRemove) {
// //       cognitoIdentityServiceProvider.adminRemoveUserFromGroup(
// //         {
// //           UserPoolId: poolDataConfig.UserPoolId,
// //           Username: selectedUser?.id as string,
// //           GroupName: roleToRemove,
// //         },
// //         (err, result) => {
// //           if (err) {
// //             toast.error(`Error removing role: ${roleToRemove}, ${err.message}`);
// //           } else {
// //             console.log(`Removed role: ${roleToRemove}`);
// //           }
// //         },
// //       );
// //     }

// //     const attributeList = [
// //       new AmazonCognitoIdentity.CognitoUserAttribute({
// //         Name: 'custom:type',
// //         Value: changedRole,
// //       }),
// //       new AmazonCognitoIdentity.CognitoUserAttribute({
// //         Name: 'custom:first_time_login',
// //         Value: '1',
// //       }),
// //     ];

// //     cognitoIdentityServiceProvider.adminUpdateUserAttributes(
// //       {
// //         UserAttributes: attributeList,
// //         Username: selectedUser?.email as string,
// //         UserPoolId: poolDataConfig.UserPoolId,
// //       },
// //       (err, result) => {
// //         if (err) {
// //           toast.error(err.message);
// //         } else {
// //           console.log(result);
// //         }
// //       },
// //     );

// //     const params = {
// //       UserPoolId: poolDataConfig.UserPoolId,
// //       Username: selectedUser?.id as string,
// //       GroupName: changedRole,
// //     };
// //     cognitoIdentityServiceProvider.adminAddUserToGroup(params, async (err: AWSError, result) => {
// //       if (err) {
// //         toast.error(err.message);
// //       }
// //       if (result) {
// //         addRoleMutation(
// //           {
// //             userId: selectedUser?.id as string,
// //             userType: changedRole,
// //           },
// //           {
// //             onSuccess: () => {
// //               toast.success(`Added Role: ${changedRole}`);
// //               refetch();
// //             },
// //           },
// //         );
// //       }
// //     });
// //     if (changedRole === userAcessType.RESEARCHER) {
// //       const attributeList = [
// //         new AmazonCognitoIdentity.CognitoUserAttribute({
// //           Name: 'custom:type',
// //           Value: changedRole,
// //         }),
// //         new AmazonCognitoIdentity.CognitoUserAttribute({
// //           Name: 'custom:first_time_login',
// //           Value: '1',
// //         }),
// //       ];
// //       const params = {
// //         UserPoolId: poolDataConfig.UserPoolId,
// //         Username: selectedUser?.id as string,
// //         GroupName: changedRole,
// //       };
// //       cognitoIdentityServiceProvider.adminUpdateUserAttributes(
// //         {
// //           UserAttributes: attributeList,
// //           Username: selectedUser?.email as string,
// //           UserPoolId: poolDataConfig.UserPoolId,
// //         },
// //         (err, result) => {
// //           if (err) {
// //             toast.error(err.message);
// //           }
// //           if (result) {
// //             console.log(result);
// //           }
// //         },
// //       );
// //       cognitoIdentityServiceProvider.adminAddUserToGroup(
// //         params,
// //         async (err: AWSError, result) => {
// //           if (err) {
// //             toast.error(err.message);
// //           }
// //           if (result) {
// //             addRoleMutation(
// //               {
// //                 userId: selectedUser?.id as string,
// //                 userType: changedRole,
// //               },
// //               {
// //                 onSuccess: () => {
// //                   toast.success('Added Role Researcher');
// //                   refetch();
// //                 },
// //               },
// //             );
// //           }
// //         },
// //       );
// //     }
// //   } catch (error) {
// //     if (error instanceof AxiosError) {
// //       const errorMessage = FindAuthErrorMessage(error);
// //       if (errorMessage) {
// //         toast.error(errorMessage.EN);
// //       }
// //     }
// //   }
// // };
// // const addUserToGroup = async (userId: string, groupName: string) => {
// //   const params = {
// //     UserPoolId: poolDataConfig.UserPoolId,
// //     Username: userId,
// //     GroupName: groupName,
// //   };

// //   return new Promise((resolve, reject) => {
// //     cognitoIdentityServiceProvider.adminAddUserToGroup(params, (err, result) => {
// //       if (err) {
// //         toast.error(`Error adding user to group: ${err.message}`);
// //         reject(err);
// //       } else {
// //         console.log(`Added to group: ${groupName}`);
// //         resolve(result);
// //       }
// //     });
// //   });
// // };
